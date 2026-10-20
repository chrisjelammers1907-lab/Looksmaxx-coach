import { test, expect } from "@playwright/test";
import { createServer, request, type Server } from "node:http";
import { once } from "node:events";
import type { AddressInfo } from "node:net";

// Exercise the compiled app through a real local forwarding server. Its Host
// header matches the ChatGPT gateway, without contacting or impersonating the
// authenticated chatgpt.com visualization UI.
let gateway: Server;
let gatewayOrigin: string;

test.beforeAll(async () => {
  gateway = createServer((incoming, outgoing) => {
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path: incoming.url,
        method: incoming.method,
        headers: { ...incoming.headers, host: "chatgpt.com" },
      },
      (response) => {
        outgoing.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(outgoing);
      },
    );
    upstream.on("error", () => {
      outgoing.writeHead(502);
      outgoing.end("Preview upstream unavailable");
    });
    incoming.pipe(upstream);
  });
  gateway.listen(0, "127.0.0.1");
  await once(gateway, "listening");
  gatewayOrigin = `http://127.0.0.1:${(gateway.address() as AddressInfo).port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    gateway.close((error) => (error ? reject(error) : resolve())),
  );
});

test("preview accepts the gateway host and still rejects unrelated hosts", async ({
  request,
}) => {
  for (const port of [3000, 5173]) {
    for (const host of [
      "chatgpt.com",
      "preview.codex-cloud-environments.chatgpt.com",
    ]) {
      const response = await request.get(`http://127.0.0.1:${port}/`, {
        headers: { Host: host },
      });
      expect(response.status()).toBe(200);
      expect(await response.text()).toContain("CHARETT");
    }
    const rejected = await request.get(`http://127.0.0.1:${port}/`, {
      headers: { Host: "unrelated.example.test" },
    });
    expect(rejected.status()).toBe(403);
  }
});

test("compiled preview loads and navigates through the gateway on mobile and desktop", async ({
  page,
}, testInfo) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  page.on("requestfailed", (request) =>
    failures.push(`${request.failure()?.errorText} ${request.url()}`),
  );

  const response = await page.goto(gatewayOrigin);
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("Your everyday, elevated.");
  await page.getByRole("button", { name: "Skip for now" }).click();
  const navigation = page.getByRole("navigation", {
    name:
      testInfo.project.name === "mobile"
        ? "Mobile navigation"
        : "Main navigation",
    exact: true,
  });

  for (const topic of [
    "skincare",
    "clothing",
    "hair",
    "gym",
    "grooming",
    "smile",
    "fragrance",
    "photos",
  ]) {
    await page.locator(`main a[href="/topics/${topic}"]`).click();
    await expect(page).toHaveURL(`${gatewayOrigin}/topics/${topic}`);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    expect((await page.reload())?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await navigation.getByRole("link", { name: "Home", exact: true }).click();
  }

  for (const [path, label] of [
    ["/explore", "Explore"],
    ["/plan", "plan"],
    ["/messages", "Messages"],
    ["/profile", "profile"],
  ]) {
    await navigation
      .getByRole("link", { name: new RegExp(label, "i") })
      .click();
    await expect(page).toHaveURL(`${gatewayOrigin}${path}`);
    await expect(page.locator("h1")).toBeVisible();
  }
  await navigation.getByRole("link", { name: "Home", exact: true }).click();
  await page
    .getByRole("link", { name: "Meet your personal coach", exact: true })
    .click();
  await expect(page).toHaveURL(`${gatewayOrigin}/coach`);
  await expect(
    page.getByRole("heading", { name: "Your personal coach." }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Your everyday, elevated.");
  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "Your personal coach." }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await testInfo.attach("compiled-preview-navigation", {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
  const brokenImages = await page
    .locator("img")
    .evaluateAll(
      (images) =>
        images.filter(
          (image) =>
            !(image as HTMLImageElement).complete ||
            (image as HTMLImageElement).naturalWidth === 0,
        ).length,
    );
  expect(brokenImages).toBe(0);
  expect(failures).toEqual([]);
});
