#!/usr/bin/env bash
# Builds the About page's scroll sequence from Pexels video 10210101
# (cottonbro studio, Pexels licence). From 0.2 s to 8.4 s the empty, dark
# studio fills, he walks in from the right, stops in the middle and turns to
# look into the camera: 120 frames in two sets.
#   w  1920 × 1012, the full landscape frame, for wide screens.
#   p  720 × 1280, a 9:16 crop that follows him across the frame, for phones.
set -euo pipefail
SRC="${1:?usage: build-about-sequence.sh <10210101.mp4>}"
OUT="$(dirname "$0")/../public/assets/about-turn"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
GRADE="eq=contrast=1.05:saturation=0.92:gamma=0.97,colorbalance=rs=0.02:bs=-0.02:rm=0.015:bm=-0.015"
# Left edge of the phone crop per frame, in source pixels (2732 wide): his
# measured position, smoothed, so the crop pans with him like a camera.
PATH_X=(1922 1922 1922 1922 1922 1922 1922 1921 1921 1921 1921 1920 1920 1919 1918
  1917 1915 1913 1910 1906 1900 1893 1883 1870 1853 1830 1800 1767 1730
  1690 1650 1610 1570 1530 1493 1455 1420 1386 1354 1324 1296 1270 1245
  1221 1199 1179 1161 1143 1128 1113 1100 1089 1078 1069 1060 1053 1046
  1040 1034 1029 1023 1018 1012 1007 1002 997 992 987 983 979 975 972 970
  968 966 966 966 966 968 969 971 972 974 976 978 981 983 986 988 991 995
  998 1001 1004 1007 1009 1011 1013 1015 1017 1018 1020 1021 1022 1023
  1023 1024 1025 1025 1026 1027 1028 1029 1029 1029 1029 1029 1029 1028
  1028)
ffmpeg -v error -y -ss 0.2 -t 8.2 -i "$SRC" -vf "fps=120/8.2,$GRADE" \
  -frames:v 120 "$TMP/%03d.png"
rm -rf "$OUT" && mkdir -p "$OUT/w" "$OUT/p"
for i in $(seq 1 120); do
  n=$(printf %03d "$i")
  ffmpeg -v error -y -i "$TMP/$n.png" -vf "scale=1920:1012:flags=lanczos" \
    -c:v libwebp -quality 66 -compression_level 6 "$OUT/w/$n.webp"
  ffmpeg -v error -y -i "$TMP/$n.png" \
    -vf "crop=810:1440:${PATH_X[$((i - 1))]}:0,scale=720:1280:flags=lanczos" \
    -c:v libwebp -quality 64 -compression_level 6 "$OUT/p/$n.webp"
done
ls "$OUT/w" | wc -l
du -sh "$OUT/w" "$OUT/p"
