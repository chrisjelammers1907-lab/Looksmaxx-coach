/** Story-sized share cards (1080×1920) for Instagram and TikTok. */
import { weightLabel } from "./units";
import type { AppSettings } from "./types";

type WeightUnit = AppSettings["weightUnit"];
export interface ShareCardOptions {
  title: string;
  subtitle: string;
  /** A same-origin image URL; cross-origin images would taint the canvas. */
  image?: string;
  kind: "post" | "outfit" | "pr";
}

const W = 1080;
const H = 1920;
const FOREST = "#123d32";
const IVORY = "#f6f0e4";
const CHAMPAGNE = "#c5a46d";
const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"DM Sans", system-ui, sans-serif';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Splits text into lines that fit the width, at most `max` lines. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  max: number,
) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    lines.length = max;
    lines[max - 1] = `${lines[max - 1].replace(/\s+\S*$/, "")}…`;
  }
  return lines;
}

export async function renderShareCard(opts: ShareCardOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = FOREST;
  ctx.fillRect(0, 0, W, H);
  // Text stays above the bottom ~150px, where Stories puts its own controls.
  const photoH = 1150;
  if (opts.image) {
    try {
      const img = await loadImage(opts.image);
      // Cover the photo area, keeping faces in the upper third.
      const scale = Math.max(W / img.width, photoH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, photoH);
      ctx.clip();
      ctx.drawImage(img, (W - w) / 2, (photoH - h) * 0.3, w, h);
      ctx.restore();
    } catch {
      // No photo: the forest card still carries the title.
    }
  }
  const fade = ctx.createLinearGradient(0, photoH - 260, 0, photoH);
  fade.addColorStop(0, "rgba(18, 61, 50, 0)");
  fade.addColorStop(1, FOREST);
  ctx.fillStyle = fade;
  ctx.fillRect(0, photoH - 260, W, 260);

  const label = { post: "THE EDIT", outfit: "THE OUTFIT", pr: "NEW PR" }[
    opts.kind
  ];
  ctx.fillStyle = CHAMPAGNE;
  ctx.font = `600 30px ${SANS}`;
  ctx.letterSpacing = "6px";
  ctx.fillText(label, 96, photoH + 70);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = IVORY;
  ctx.font = `500 96px ${SERIF}`;
  let y = photoH + 180;
  const titleLines = wrap(ctx, opts.title, W - 192, 3);
  for (const line of titleLines) {
    ctx.fillText(line, 96, y);
    y += 104;
  }
  ctx.globalAlpha = 0.82;
  ctx.font = `400 36px ${SANS}`;
  for (const line of wrap(
    ctx,
    opts.subtitle,
    W - 192,
    titleLines.length > 2 ? 1 : 2,
  )) {
    ctx.fillText(line, 96, y + 4);
    y += 50;
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = CHAMPAGNE;
  ctx.fillRect(96, H - 210, 64, 2);
  ctx.fillStyle = IVORY;
  ctx.font = `500 44px ${SERIF}`;
  ctx.letterSpacing = "18px";
  ctx.fillText("CHARETT", 96, H - 150);
  ctx.letterSpacing = "0px";
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No card"))),
      "image/png",
    ),
  );
}

/** The card for a new personal record; both weights carry their unit. */
export const prShareCard = (
  exercise: string,
  previousKg: number,
  topKg: number,
  unit: WeightUnit,
): ShareCardOptions => ({
  title: `${exercise}: ${weightLabel(topKg, unit)}`,
  subtitle: `Up from ${weightLabel(previousKg, unit)}. Logged with CHARETT.`,
  kind: "pr",
});

export const shareFileName = (title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return slug ? `charett-${slug}.png` : "charett.png";
};

/** Opens the share sheet where the device supports files, else downloads. */
export async function shareOrDownload(
  blob: Blob,
  name: string,
): Promise<"shared" | "downloaded"> {
  const file = new File([blob], name, { type: blob.type || "image/png" });
  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (error) {
      // Closing the sheet is a choice, not a failure.
      if (error instanceof DOMException && error.name === "AbortError")
        return "shared";
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
