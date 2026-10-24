import type { FeedMedia } from "./types";
export function feedDimensions(
  width: number,
  height: number,
  chosenHeight?: number,
) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    throw new Error("Invalid image dimensions");
  const targetHeight = Math.round(
    Math.min(1920, Math.max(1350, chosenHeight ?? (1080 * height) / width)),
  );
  return { width: 1080, height: targetHeight };
}
export function normaliseFeedPhoto(
  src: string,
  chosenHeight?: number,
  x = 50,
  y = 50,
): Promise<Pick<FeedMedia, "src" | "width" | "height">> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const dimensions = feedDimensions(
          image.naturalWidth,
          image.naturalHeight,
          chosenHeight,
        );
        const scale = Math.max(
          dimensions.width / image.naturalWidth,
          dimensions.height / image.naturalHeight,
        );
        const sw = dimensions.width / scale,
          sh = dimensions.height / scale;
        const sx =
          ((image.naturalWidth - sw) * Math.min(100, Math.max(0, x))) / 100;
        const sy =
          ((image.naturalHeight - sh) * Math.min(100, Math.max(0, y))) / 100;
        const canvas = document.createElement("canvas");
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const ctx = canvas.getContext("2d");
        if (!ctx)
          throw new Error("Photo processing is unavailable in this browser.");
        ctx.drawImage(
          image,
          sx,
          sy,
          sw,
          sh,
          0,
          0,
          dimensions.width,
          dimensions.height,
        );
        resolve({ ...dimensions, src: canvas.toDataURL("image/jpeg", 0.88) });
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () =>
      reject(new Error("This file could not be decoded as an image."));
    image.src = src;
  });
}
const privateUrls = new Set<string>();
export function privateVideoUrl(file: Blob) {
  const url = URL.createObjectURL(file);
  privateUrls.add(url);
  return url;
}
/** Session-only object URL for any private blob (voice notes, files). */
export const privateMediaUrl = privateVideoUrl;
export function releasePrivateMedia() {
  privateUrls.forEach((url) => URL.revokeObjectURL(url));
  privateUrls.clear();
}
