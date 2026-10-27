import { useEffect, useRef, useState } from "react";

export const TURN_FRAMES = 120;

type FrameSet = "w" | "p";

/** Frame paths for the About story; w for wide screens, p for upright ones. */
const framePath = (set: FrameSet, index: number) =>
  `${import.meta.env.BASE_URL}assets/about-turn/${set}/${String(index + 1).padStart(3, "0")}.webp`;

/** Upright screens get the crop that follows him; wide ones the full frame. */
const UPRIGHT = "(orientation: portrait)";

/**
 * Story progress (0–1) to frame: each chapter lands on its own moment.
 * The empty studio, he walks in, in profile, stops, turns, looks at you.
 */
const KEYS: [number, number][] = [
  [0, 0],
  [0.149, 4],
  [0.299, 26],
  [0.448, 48],
  [0.597, 66],
  [0.746, 88],
  [0.896, TURN_FRAMES - 1],
  [1, TURN_FRAMES - 1],
];
export const frameAt = (p: number) => {
  for (let k = 1; k < KEYS.length; k++) {
    const [p1, f1] = KEYS[k];
    if (p <= p1) {
      const [p0, f0] = KEYS[k - 1];
      return f0 + ((f1 - f0) * (p - p0)) / (p1 - p0);
    }
  }
  return TURN_FRAMES - 1;
};
/** He holds your gaze while the frame slowly closes in. */
const zoomAt = (p: number) => {
  const t = Math.min(1, Math.max(0, (p - 0.8) / 0.2));
  return 1 + 0.09 * t * t * (3 - 2 * t);
};

const useUpright = () => {
  const [upright, setUpright] = useState(() => matchMedia(UPRIGHT).matches);
  useEffect(() => {
    const query = matchMedia(UPRIGHT);
    const change = () => setUpright(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return upright;
};

/**
 * The About film, drawn frame by frame on a full-screen canvas as the story
 * scrolls. `progress` (0–1) is read every animation frame and eased, so the
 * film glides even when the scroll jumps. It also sets `--intro` (1 → 0 over
 * the first stretch) on the stage for the opening wordmark.
 */
export default function TurnSequence({ progress }: { progress: () => number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const upright = useUpright();
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const set: FrameSet = upright ? "p" : "w";
    const stage = node.parentElement;
    const frames: HTMLImageElement[] = [];
    let shown = 0;
    let target = 0;
    let drawnKey = "";
    let raf = 0;
    let alive = true;

    const fit = () => {
      const scale = Math.min(devicePixelRatio, 2);
      node.width = Math.round(node.clientWidth * scale);
      node.height = Math.round(node.clientHeight * scale);
      drawnKey = "";
    };
    const draw = (index: number, zoom: number) => {
      let i = Math.round(index);
      while (i > 0 && !frames[i]?.complete) i--;
      const img = frames[i];
      const key = `${i}:${zoom.toFixed(4)}`;
      if (
        !img?.complete ||
        !img.naturalWidth ||
        !node.width ||
        key === drawnKey
      )
        return;
      const { width: W, height: H } = node;
      // Cover the screen. Wide screens trim the left more than the right, so
      // he stands clear of the text. At the end, close in on his face.
      const base = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w0 = img.naturalWidth * base;
      const h0 = img.naturalHeight * base;
      const x0 = (W - w0) * (upright ? 0.5 : 0.15);
      const y0 = (H - h0) * 0.32;
      const [fx, fy] = upright ? [0.5, 0.3] : [0.55, 0.3];
      const w = w0 * zoom;
      const h = h0 * zoom;
      ctx.drawImage(img, x0 + fx * w0 - fx * w, y0 + fy * h0 - fy * h, w, h);
      drawnKey = key;
      node.dataset.frame = String(i);
    };
    const tick = () => {
      raf = 0;
      const p = progress();
      target = frameAt(p);
      shown += (target - shown) * 0.22;
      if (Math.abs(target - shown) < 0.05) shown = target;
      draw(shown, zoomAt(p));
      stage?.style.setProperty(
        "--intro",
        String(Math.max(0, 1 - p / 0.11).toFixed(3)),
      );
      if (shown !== target && alive) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (alive && Math.round(shown) >= i) drawnKey = "";
          if (alive) onScroll();
          resolve();
        };
        img.src = framePath(set, i);
        frames[i] = img;
      });

    node.dataset.frame = "0";
    // Size from the real box, also when it is laid out after the first paint.
    const resize = new ResizeObserver(() => {
      fit();
      onScroll();
    });
    resize.observe(node);
    shown = frameAt(progress());
    load(0).then(async () => {
      // Load the rest in order, a few at a time, without blocking the page.
      for (let i = 1; i < TURN_FRAMES && alive; i += 8)
        await Promise.all(
          Array.from({ length: Math.min(8, TURN_FRAMES - i) }, (_, k) =>
            load(i + k),
          ),
        );
    });
    // Capture, so a scrolling container other than the page also counts.
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [progress, upright]);
  return <canvas ref={canvas} aria-hidden="true" />;
}

/** The still used with reduced motion: he looks into the camera. */
export const turnStill = () => framePath("p", TURN_FRAMES - 1);
