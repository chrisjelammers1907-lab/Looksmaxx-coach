import { useEffect, useRef } from "react";

export const TURN_FRAMES = 90;

/** Frame paths for the About turn; s for phones, l for large screens. */
const framePath = (size: "s" | "l", index: number) =>
  `${import.meta.env.BASE_URL}assets/about-turn/${size}/${String(index + 1).padStart(3, "0")}.webp`;

/** Upright screens show him edge to edge; wide ones extend the studio wall. */
const UPRIGHT = "(orientation: portrait)";

/**
 * A portrait that turns frame by frame with the scroll, drawn on a canvas
 * that fills the screen. `progress` (0–1) is read on every animation frame.
 * The first frame shows at once; the rest load in order in the background.
 */
export default function TurnSequence({ progress }: { progress: () => number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const size =
      Math.max(node.clientHeight, innerHeight) * Math.min(devicePixelRatio, 2) >
      900
        ? "l"
        : "s";
    const frames: HTMLImageElement[] = [];
    // The wide layout feathers each frame into the wall on a second canvas.
    const layer = document.createElement("canvas");
    const layerCtx = layer.getContext("2d");
    let wall: [string, string] | null = null;
    let drawn = -1;
    let wanted = 0;
    let raf = 0;
    let alive = true;

    // Average colour of a small patch of studio wall at the frame's right edge.
    const sample = (img: HTMLImageElement, y: number) => {
      const probe = document.createElement("canvas");
      probe.width = probe.height = 1;
      const p = probe.getContext("2d", { willReadFrequently: true });
      if (!p) return "#8c837f";
      const w = img.naturalWidth * 0.03;
      p.drawImage(
        img,
        img.naturalWidth - w,
        img.naturalHeight * y,
        w,
        w,
        0,
        0,
        1,
        1,
      );
      const [r, g, b] = p.getImageData(0, 0, 1, 1).data;
      return `rgb(${r} ${g} ${b})`;
    };
    const fit = () => {
      const scale = Math.min(devicePixelRatio, 2);
      node.width = Math.round(node.clientWidth * scale);
      node.height = Math.round(node.clientHeight * scale);
      drawn = -1;
    };
    const draw = (index: number) => {
      let i = index;
      while (i > 0 && !frames[i]?.complete) i--;
      const img = frames[i];
      if (!img?.complete || !img.naturalWidth || !node.width || i === drawn)
        return;
      const { width: W, height: H } = node;
      if (matchMedia(UPRIGHT).matches || !layerCtx) {
        // Cover the screen, keeping the head in the upper third.
        const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.drawImage(img, (W - w) / 2, (H - h) * 0.3, w, h);
      } else {
        // Full height against the left edge, where the clip itself is cut;
        // the wall carries on to the right behind the text.
        wall ??= [sample(img, 0.04), sample(img, 0.5)];
        const w = Math.round((img.naturalWidth * H) / img.naturalHeight);
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, wall[0]);
        bg.addColorStop(1, wall[1]);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        layer.width = w;
        layer.height = H;
        layerCtx.drawImage(img, 0, 0, w, H);
        const edge = layerCtx.createLinearGradient(0, 0, w, 0);
        edge.addColorStop(0.72, "#000");
        edge.addColorStop(1, "#0000");
        layerCtx.globalCompositeOperation = "destination-in";
        layerCtx.fillStyle = edge;
        layerCtx.fillRect(0, 0, w, H);
        layerCtx.globalCompositeOperation = "source-over";
        ctx.drawImage(layer, 0, 0);
      }
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

    node.dataset.frame = "0";
    // Size from the real box, also when it is laid out after the first paint.
    const resize = new ResizeObserver(() => {
      fit();
      tick();
    });
    resize.observe(node);
    load(0).then(async () => {
      tick();
      // Load the rest in order, a few at a time, without blocking the page.
      for (let i = 1; i < TURN_FRAMES && alive; i += 6)
        await Promise.all(
          Array.from({ length: Math.min(6, TURN_FRAMES - i) }, (_, k) =>
            load(i + k),
          ),
        );
      if (alive) tick();
    });
    // Capture, so a scrolling container other than the page also counts.
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [progress]);
  return <canvas ref={canvas} aria-hidden="true" />;
}

/** The still used with reduced motion: he faces the camera. */
export const turnStill = () => framePath("l", TURN_FRAMES - 1);
