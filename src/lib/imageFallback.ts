/** A linen tint the size of a portrait photo, shown when a photo fails. */
const TINT =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><rect width="100%" height="100%" fill="#e7dfd0"/></svg>',
  );

/** Swaps any image that fails to load for the tint, once, app-wide. */
export function installImageFallback(root: Document = document) {
  root.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.missing) return;
      img.dataset.missing = "true";
      img.removeAttribute("srcset");
      img.src = TINT;
    },
    true,
  );
}
