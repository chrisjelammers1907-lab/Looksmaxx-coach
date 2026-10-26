#!/usr/bin/env bash
# Builds the About page's scroll sequence from Pexels video 7451428
# ("Man Touching his Hair and Posing for the Camera", cottonbro studio,
# Pexels licence). The turn from back to camera runs from 1.0 s to 4.6 s:
# 90 frames at 25 fps, cropped to 9:16, warm-graded toward taupe to sit with
# the cream and forest palette. Two sizes: s (phones) and l (large screens).
set -euo pipefail
SRC="${1:?usage: build-about-sequence.sh <7451428.mp4>}"
OUT="$(dirname "$0")/../public/assets/about-turn"
GRADE="colorbalance=rs=0.04:gs=0.015:bs=-0.03:rm=0.03:gm=0.03:bm=-0.04:rh=0.02:gh=0.015:bh=-0.03,eq=saturation=0.82:contrast=1.04:gamma=0.98"
for size in s:432:768:62 l:720:1280:68; do
  IFS=: read -r name w h q <<<"$size"
  rm -rf "$OUT/$name" && mkdir -p "$OUT/$name"
  ffmpeg -v error -y -ss 1.0 -t 3.6 -i "$SRC" \
    -vf "fps=25,crop=2160:3840:0:96,scale=$w:$h:flags=lanczos,$GRADE" \
    -c:v libwebp -quality "$q" -compression_level 6 "$OUT/$name/%03d.webp"
done
ls "$OUT/s" | wc -l
du -sh "$OUT/s" "$OUT/l"
