import { useEffect, useRef } from "react";

export const TURN_FRAMES = 90;

/** Frame paths for the About turn; s for phones, l for large screens. */
const framePath = (size: "s" | "l", index: number) =>
  `${import.meta.env.BASE_URL}assets/about-turn/${size}/${String(index + 1).padStart(3, "0")}.webp`;

/**
 * A portrait that turns frame by frame with the scroll, drawn on a canvas.
 * `progress` (0–1) is read on every animation frame from the story section.
 * The first frame shows at once; the rest load in order in the background.
 */
export default function TurnSequence({ progress }: { progress: () => number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const size =
      node.clientHeight * Math.min(devicePixelRatio, 2) > 900 ? "l" : "s";
    const frames: HTMLImageElement[] = [];
    let drawn = -1;
    let wanted = 0;
    let raf = 0;
    let alive = true;

    const fit = () => {
      const scale = Math.min(devicePixelRatio, 2);
      node.width = Math.round(node.clientWidth * scale);
      node.height = Math.round(node.clientHeight * scale);
      drawn = -1;
    };
    // Cover the canvas, keeping the head in the upper third.
    const draw = (index: number) => {
      let i = index;
      while (i > 0 && !frames[i]?.complete) i--;
      const img = frames[i];
      if (!img?.complete || !img.naturalWidth || i === drawn) return;
      const scale = Math.max(
        node.width / img.naturalWidth,
        node.height / img.naturalHeight,
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (node.width - w) / 2, (node.height - h) * 0.3, w, h);
      drawn = i;
      node.dataset.frame = String(i);
    };
    const tick = () => {
      raf = 0;
      wanted = Math.round(progress() * (TURN_FRAMES - 1));
      draw(wanted);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (alive && i <= wanted) draw(wanted);
          resolve();
        };
        img.src = framePath(size, i);
        frames[i] = img;
      });

    fit();
    node.dataset.frame = "0";
    load(0).then(async () => {
      draw(0);
      // Load the rest in order, a few at a time, without blocking the page.
      for (let i = 1; i < TURN_FRAMES && alive; i += 6)
        await Promise.all(
          Array.from({ length: Math.min(6, TURN_FRAMES - i) }, (_, k) =>
            load(i + k),
          ),
        );
      if (alive) tick();
    });
    const onResize = () => {
      fit();
      tick();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, [progress]);
  return <canvas ref={canvas} aria-hidden="true" />;
}

/** The still used with reduced motion: he faces the camera. */
export const turnStill = () => framePath("l", TURN_FRAMES - 1);
