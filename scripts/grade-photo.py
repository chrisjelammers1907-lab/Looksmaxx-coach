"""Fit within 1080x1350, add a light warm, muted grade, save <= 90 KB."""
import os
import sys
from PIL import Image, ImageEnhance

src, dst = sys.argv[1], sys.argv[2]
base = Image.open(src).convert("RGB")
base = ImageEnhance.Color(base).enhance(0.92)
r, g, b = base.split()
base = Image.merge(
    "RGB",
    (r.point(lambda v: min(255, int(v * 1.03 + 2))), g, b.point(lambda v: int(v * 0.97))),
)
for box in ((1080, 1350), (960, 1200), (860, 1080), (760, 950)):
    im = base.copy()
    im.thumbnail(box, Image.LANCZOS)
    for q in range(80, 54, -4):
        im.save(dst, "JPEG", quality=q, optimize=True, progressive=True)
        if os.path.getsize(dst) <= 90 * 1024:
            sys.exit(0)
sys.exit("could not reach 90 KB: " + src)
