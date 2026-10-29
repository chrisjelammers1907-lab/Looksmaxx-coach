import { describe, expect, it } from "vitest";
import { makeInitialState, seedItems, seedPosts } from "../src/lib/data";
import {
  totalPrice,
  safePurchaseUrl,
  maySharePost,
  mayViewPost,
  workoutVolume,
} from "../src/lib/domain";
import { feedDimensions } from "../src/lib/media";
import { inferCoachTopic } from "../src/lib/services";
import { demoCoach } from "../src/lib/services";
describe("outfit price accounting", () => {
  it("totals known prices in a single currency", () =>
    expect(totalPrice(seedItems.slice(0, 3))).toBe("€177.00"));
  it("distinguishes unknown values from free items", () => {
    expect(totalPrice([{ ...seedItems[0], price: 0 }])).toBe("€0.00");
    expect(totalPrice([{ ...seedItems[0], price: null }])).toBe(
      "Price unavailable",
    );
  });
  it("keeps a partial subtotal explicit", () =>
    expect(totalPrice([seedItems[0], { ...seedItems[1], price: null }])).toBe(
      "From €59.00",
    ));
  it("never adds mixed currencies", () =>
    expect(
      totalPrice([seedItems[0], { ...seedItems[1], currency: "USD" }]),
    ).toContain("Mixed currencies"));
  it("handles empty outfits", () =>
    expect(totalPrice([])).toBe("No items yet"));
});
describe("access and purchase boundaries", () => {
  it("rejects unsafe and unavailable links", () => {
    expect(safePurchaseUrl("javascript:alert(1)")).toBeNull();
    expect(safePurchaseUrl("http://example.com")).toBeNull();
    expect(safePurchaseUrl("")).toBeNull();
    expect(safePurchaseUrl("https://example.com/item")).toBe(
      "https://example.com/item",
    );
  });
  it("allows public posts and forbids private recipient access", () => {
    expect(maySharePost(seedPosts[0])).toBe(true);
    expect(maySharePost({ ...seedPosts[0], audience: "private" })).toBe(false);
    expect(mayViewPost({ ...seedPosts[0], audience: "private" }, "mira")).toBe(
      true,
    );
    expect(mayViewPost({ ...seedPosts[0], audience: "private" }, "noor")).toBe(
      false,
    );
  });
  it("denies removed, follower-restricted and blocked content", () => {
    expect(mayViewPost(undefined)).toBe(false);
    expect(maySharePost(undefined)).toBe(false);
    expect(maySharePost({ ...seedPosts[0], audience: "followers" })).toBe(
      false,
    );
    expect(mayViewPost(seedPosts[0], "you", ["mira"])).toBe(false);
    // Drafts stay with their author and can never be shared.
    const draft = { ...seedPosts[0], draft: true };
    expect(mayViewPost(draft, "mira")).toBe(true);
    expect(mayViewPost(draft, "noor")).toBe(false);
    expect(maySharePost(draft)).toBe(false);
  });
});
describe("meaningful workout and coach behavior", () => {
  it("calculates logged training volume", () =>
    expect(workoutVolume(3, 8, 14)).toBe(336));
  it("uses explicit context, labels photo feedback, and leaves routines unchanged", async () => {
    const state = makeInitialState();
    state.profile.goals = "Try a simpler wardrobe";
    const before = JSON.stringify(state);
    const result = await demoCoach.reply({
      text: "Review my photo",
      topic: "clothing",
      hasPhoto: true,
      state,
    });
    expect(result.text).toContain("Try a simpler wardrobe");
    expect(result.text).toContain("The linen shirt");
    expect(result.text).toContain("haven’t judged");
    expect(result.proposal).toContain("owned pieces");
    expect(JSON.stringify(state)).toBe(before);
  });
  it("does not turn medication questions into dose advice", async () => {
    const result = await demoCoach.reply({
      text: "What DNP dose?",
      hasPhoto: false,
      state: makeInitialState(),
    });
    expect(result.text).toContain("can’t diagnose");
    expect(result.text).toContain("through a doctor");
    expect(result.text).not.toMatch(/unvalidated|uploaded treatment/);
  });
});

describe("second-version privacy and format invariants", () => {
  it("caps both portrait extremes at the required pixel sizes", () => {
    expect(feedDimensions(400, 400)).toEqual({ width: 1080, height: 1350 });
    expect(feedDimensions(300, 900)).toEqual({ width: 1080, height: 1920 });
    expect(feedDimensions(2160, 3240)).toEqual({ width: 1080, height: 1620 });
    expect(() => feedDimensions(0, 100)).toThrow();
  });
  it("a public post never overrides a private account", () => {
    const post = { ...seedPosts[0], author: "you" };
    expect(mayViewPost(post, "visitor", [], "private")).toBe(false);
    expect(mayViewPost(post, "mira", [], "private", ["mira"])).toBe(true);
    expect(mayViewPost(post, "noor", [], "private", ["mira"])).toBe(false);
    expect(maySharePost(post, [], "private", "mira", ["mira"])).toBe(true);
    expect(maySharePost(post, [], "private", "noor", ["mira"])).toBe(false);
    expect(mayViewPost(post, "visitor", [], "public")).toBe(true);
  });
  it("private originals never become accessible through audience switches", () => {
    const post = {
      ...seedPosts[0],
      author: "you",
      media: {
        kind: "image" as const,
        src: "data:image/jpeg;base64,private",
        width: 1080,
        height: 1350,
        origin: "private-upload" as const,
        label: "Private",
      },
    };
    expect(maySharePost(post, [], "public", "mira", ["mira"])).toBe(false);
    expect(mayViewPost(post, "mira", [], "public", ["mira"])).toBe(false);
    expect(
      mayViewPost({ ...post, audience: "private" }, "mira", [], "private", [
        "mira",
      ]),
    ).toBe(false);
    expect(mayViewPost(post, "you", [], "private")).toBe(true);
  });
  it("uses a clear new question before old context and keeps vague followups in context", () => {
    expect(inferCoachTopic("My skin feels dry", "clothing")).toBe("skincare");
    expect(inferCoachTopic("Review my photo", "clothing")).toBe("clothing");
    expect(inferCoachTopic("Which hair colour should I try?")).toBe("hair");
    expect(inferCoachTopic("Help me with my eyebrow shape")).toBe("brows");
    expect(inferCoachTopic("How do I fix my beard neckline?")).toBe("grooming");
    expect(inferCoachTopic("Does mewing change my jaw?")).toBe("face");
  });
});

describe("coach topic routing", () => {
  it.each([
    ["What shoes go with chinos?", "clothing"],
    ["Which handbag goes with this outfit?", "clothing"],
    ["How do I look more handsome?", undefined],
    ["I want a tank top outfit", "clothing"],
    ["Tips for my tan suit", "clothing"],
    ["Best foundation pieces for a capsule wardrobe", "clothing"],
    ["How do I look confident in my outfit?", "clothing"],
    ["How do I lose weight?", "nutrition"],
    ["Hair colouring ideas", "hair"],
    ["Is mewing real?", "face"],
    ["Which foundation suits me?", "makeup"],
    ["My chin looks weak", "face"],
    ["Self-tan streaks on my legs", "colouring"],
    ["My hands are dry", "body"],
    ["How do I build confidence when I speak?", "presence"],
  ])("%s → %s", (text, topic) => expect(inferCoachTopic(text)).toBe(topic));
});
