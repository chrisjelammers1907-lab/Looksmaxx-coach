import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ImagePlus,
  Music2,
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { asset, topicName } from "../lib/domain";
import { normaliseFeedPhoto, privateVideoUrl } from "../lib/media";
import type { FeedMedia, Post } from "../lib/types";
import { Button, Select } from "./ui";
import { claimPlayback, findSound } from "../lib/sounds";
import { DEMO } from "../lib/demo";
const editorialPhotos = new Map<string, Promise<string>>();
/** The line under the handle, like a location on Instagram. */
export function mediaLabel(post: Post) {
  return post.media?.label || topicName[post.topic] || "";
}
export function PostMedia({
  post,
  children,
  onOpen,
}: {
  post: Post;
  children?: ReactNode;
  /** Tapping the media itself (not its controls) opens the post sheet. */
  onOpen?: () => void;
}) {
  const [photo, setPhoto] = useState("");
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [soundError, setSoundError] = useState("");
  const [slide, setSlide] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const media = post.media;
  const isVideo = media?.kind === "video";
  const isReel = isVideo || post.format === "reel";
  // Private media is never combined with public editorial slide references.
  const slides = media
    ? [post.image]
    : post.slides?.filter(Boolean) || [post.image];
  const slideIndex = Math.min(slide, slides.length - 1);
  const currentImage = slides[slideIndex] || post.image;
  const hasSlides = !isVideo && slides.length > 1;
  const moveSlide = (direction: number) =>
    setSlide(
      (current) => (current + direction + slides.length) % slides.length,
    );
  const sound = findSound(post.sound?.id);
  const startSound = async () => {
    if (!sound || !audio.current) return;
    claimPlayback(video.current, audio.current);
    setSoundError("");
    if (video.current)
      audio.current.currentTime = video.current.currentTime % sound.duration;
    try {
      await audio.current.play();
    } catch {
      setSoundError("Sound could not start. Tap play to try again.");
    }
  };
  useEffect(() => {
    if (audio.current) audio.current.volume = post.sound?.volume ?? 0.65;
    if (video.current) video.current.volume = post.sound?.originalVolume ?? 1;
  }, [post.sound]);
  useEffect(() => {
    if (isVideo) return;
    setFailed(false);
    if (media?.src) {
      setPhoto(media.src);
      return;
    }
    setPhoto("");
    // Vector illustrations have no intrinsic pixel size; CSS cover-crops them.
    const source = asset(currentImage);
    if (source.endsWith(".svg") || source.startsWith("data:image/svg")) {
      setPhoto(source);
      return;
    }
    let active = true;
    const cacheKey = `${currentImage}:${isReel ? 1920 : 1350}`;
    if (!editorialPhotos.has(cacheKey))
      editorialPhotos.set(
        cacheKey,
        normaliseFeedPhoto(asset(currentImage), isReel ? 1920 : 1350).then(
          (result) => result.src,
        ),
      );
    editorialPhotos
      .get(cacheKey)!
      .then((src) => {
        if (active) setPhoto(src);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [currentImage, media, isVideo, isReel]);
  useEffect(() => {
    const node = container.current;
    const film = video.current;
    const track = audio.current;
    if (!node) return;
    const stop = () => {
      film?.pause();
      track?.pause();
    };
    const hidden = () => {
      if (document.hidden) stop();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) stop();
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [isVideo, sound?.id]);
  const label = mediaLabel(post) || "editorial photo";
  return (
    <div className="post-media-wrap" ref={container}>
      <div
        data-media-origin={media?.origin || "editorial"}
        className={`post-image post-media ${isVideo ? "video-media" : ""} ${isReel ? "reel-media" : ""} ${hasSlides ? "slideshow-media" : ""}`}
        style={{
          aspectRatio: `1080 / ${isReel ? 1920 : media?.height || 1350}`,
        }}
        onClick={(event) => {
          if (!onOpen) return;
          const target = event.target as HTMLElement;
          if (target.closest("button, a, input, label")) return;
          onOpen();
        }}
        tabIndex={hasSlides ? 0 : undefined}
        role={hasSlides ? "region" : undefined}
        aria-roledescription={hasSlides ? "carousel" : undefined}
        aria-label={hasSlides ? `${post.title} photo slideshow` : undefined}
        onKeyDown={(event) => {
          if (!hasSlides || event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            moveSlide(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onTouchStart={(event) => {
          if (hasSlides)
            touchStart.current = {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
            };
        }}
        onTouchEnd={(event) => {
          if (!hasSlides || !touchStart.current) return;
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
            moveSlide(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {isVideo ? (
          <video
            ref={video}
            src={media.origin === "editorial" ? asset(media.src) : media.src}
            poster={media.poster ? asset(media.poster) : undefined}
            playsInline
            loop
            muted={!post.sound || post.sound.originalVolume === 0}
            preload="none"
            aria-label={`${post.title} — ${label}`}
            onPlay={() => {
              setVideoPlaying(true);
              claimPlayback(video.current, audio.current);
              void startSound();
            }}
            onPause={() => {
              setVideoPlaying(false);
              audio.current?.pause();
            }}
            onEnded={() => audio.current?.pause()}
            onSeeked={() => {
              if (audio.current && sound && video.current)
                audio.current.currentTime =
                  video.current.currentTime % sound.duration;
            }}
            onTimeUpdate={() => {
              if (
                audio.current &&
                sound &&
                video.current &&
                !video.current.paused
              ) {
                const target = video.current.currentTime % sound.duration;
                if (Math.abs(audio.current.currentTime - target) > 0.4)
                  audio.current.currentTime = target;
              }
            }}
          >
            {media.origin === "editorial" && (
              <track
                kind="captions"
                srcLang="en"
                label="English · instrumental, no speech"
                src="data:text/vtt,WEBVTT%0A%0A00%3A00.000%20--%3E%2000%3A05.000%0AEditorial%20motion%20study.%20Instrumental%20sound%20when%20enabled.%20No%20speech."
              />
            )}
          </video>
        ) : photo ? (
          <img
            loading="lazy"
            decoding="async"
            src={photo}
            width={1080}
            height={media?.height || (isReel ? 1920 : 1350)}
            alt={`${post.title} — ${label}`}
          />
        ) : (
          <span className="media-loading" role="status">
            {failed ? "This image could not load." : "Preparing photo…"}
          </span>
        )}
        {isVideo && (
          <button
            type="button"
            className={`video-toggle ${videoPlaying ? "is-playing" : ""}`}
            aria-label={`${videoPlaying ? "Pause" : "Play"} video ${post.title}`}
            onClick={() => {
              const film = video.current;
              if (!film) return;
              if (film.paused) void film.play().catch(() => undefined);
              else film.pause();
            }}
          >
            {videoPlaying ? <Pause size={30} /> : <Play size={34} />}
          </button>
        )}
        {hasSlides && (
          <div className="slide-controls">
            <button
              type="button"
              aria-label={`Previous photo in ${post.title}`}
              onClick={() => moveSlide(-1)}
            >
              <ChevronLeft size={19} />
            </button>
            <span
              role="status"
              aria-label="Slideshow position"
              aria-live="polite"
              aria-atomic="true"
            >
              {slideIndex + 1} / {slides.length}
            </span>
            <button
              type="button"
              aria-label={`Next photo in ${post.title}`}
              onClick={() => moveSlide(1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        )}
        {sound && (
          <div className={`post-sound ${playing ? "is-playing" : ""}`}>
            {playing && (
              <label className="post-sound-volume">
                <Volume2 size={14} aria-hidden="true" />
                <input
                  aria-label={`Sound volume for ${post.title}`}
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  defaultValue={post.sound?.volume ?? 0.65}
                  onChange={(e) => {
                    if (audio.current)
                      audio.current.volume = Number(e.target.value);
                  }}
                />
              </label>
            )}
            <button
              type="button"
              className="post-sound-play"
              aria-label={`${playing ? "Pause" : "Play"} sound ${sound.title}`}
              aria-pressed={playing}
              title={`${sound.title} · CHARETT original`}
              onClick={async () => {
                if (playing) {
                  audio.current?.pause();
                  video.current?.pause();
                } else if (video.current) {
                  try {
                    await video.current.play();
                    await startSound();
                  } catch {
                    setSoundError("Video could not start. Try again.");
                  }
                } else await startSound();
              }}
            >
              {playing ? <Volume2 size={17} /> : <Music2 size={17} />}
            </button>
            <audio
              ref={audio}
              src={asset(sound.id)}
              preload="none"
              loop
              onPlay={() => {
                claimPlayback(video.current, audio.current);
                setPlaying(true);
              }}
              onPause={() => setPlaying(false)}
              onError={() =>
                setSoundError("This sound could not load. Try again.")
              }
            />
          </div>
        )}
        {children}
      </div>
      {soundError && (
        <p className="error sound-error" role="alert">
          {soundError}
        </p>
      )}
    </div>
  );
}
export function MediaPicker({
  value,
  onChange,
}: {
  value?: FeedMedia;
  onChange: (media?: FeedMedia) => void;
}) {
  const [original, setOriginal] = useState("");
  const [height, setHeight] = useState("");
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const apply = async (src = original, h = height, fx = x, fy = y) => {
    setBusy(true);
    setError("");
    try {
      const result = await normaliseFeedPhoto(
        src,
        h ? Number(h) : undefined,
        fx,
        fy,
      );
      onChange({
        ...result,
        kind: "image",
        origin: "private-upload",
        label: "Private session photo",
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not prepare this photo.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="media-picker">
      <label className="upload">
        <ImagePlus size={22} />
        <span>Add a private test photo or video</span>
        <input
          aria-label="Add a private test photo or video"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setError("");
            const imageTypes = ["image/jpeg", "image/png", "image/webp"];
            const videoTypes = ["video/mp4", "video/webm"];
            if (
              ![...imageTypes, ...videoTypes].includes(file.type) ||
              file.size >
                (imageTypes.includes(file.type) ? 8 : 30) * 1024 * 1024
            ) {
              setError(
                "Use a JPG/PNG/WebP under 8 MB or MP4/WebM under 30 MB.",
              );
              return;
            }
            if (imageTypes.includes(file.type)) {
              const reader = new FileReader();
              reader.onload = () => {
                const src = String(reader.result);
                setOriginal(src);
                setHeight("");
                setX(50);
                setY(50);
                void apply(src, "", 50, 50);
              };
              reader.onerror = () => setError("The photo could not be read.");
              reader.readAsDataURL(file);
            } else {
              setOriginal("");
              setBusy(true);
              const src = privateVideoUrl(file);
              const video = document.createElement("video");
              video.preload = "metadata";
              video.onloadedmetadata = () => {
                if (!Number.isFinite(video.duration) || video.duration > 60) {
                  setError("Choose a clip up to 60 seconds.");
                } else {
                  onChange({
                    kind: "video",
                    src,
                    width: video.videoWidth,
                    height: video.videoHeight,
                    origin: "private-upload",
                    label: "Private session video",
                  });
                }
                setBusy(false);
                video.removeAttribute("src");
                video.load();
              };
              video.onerror = () => {
                setError("This browser could not decode that video. Try MP4.");
                setBusy(false);
              };
              video.src = src;
            }
          }}
        />
      </label>
      <p className="small-text">
        {DEMO &&
          "Private test media stays in this tab and cannot enter public demo posts. "}
        Feed photos are proportionally cropped to 1080 × 1350–1920. Upscaling
        adds no photographic detail.
      </p>
      {original && (
        <div className="media-framing">
          <Select
            label="Photo frame"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          >
            <option value="">
              Automatic · keep a supported portrait ratio
            </option>
            <option value="1350">4:5 · 1080 × 1350</option>
            <option value="1620">2:3 · 1080 × 1620</option>
            <option value="1920">9:16 · 1080 × 1920</option>
          </Select>
          <label className="field">
            <span>Horizontal framing</span>
            <input
              aria-label="Horizontal framing"
              type="range"
              min="0"
              max="100"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
            />
          </label>
          <label className="field">
            <span>Vertical framing</span>
            <input
              aria-label="Vertical framing"
              type="range"
              min="0"
              max="100"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => void apply()}
          >
            Apply photo framing
          </Button>
        </div>
      )}
      {busy && <p role="status">Preparing media…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {value && (
        <>
          <div className="upload-preview">
            {value.kind === "image" ? (
              <img src={value.src} alt="Private feed photo preview" />
            ) : (
              <video
                src={value.src}
                controls
                muted
                playsInline
                aria-label="Private video preview"
              />
            )}
            <small>
              {value.width} × {value.height} · Private session {value.kind}
            </small>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onChange(undefined);
              setOriginal("");
            }}
          >
            Remove media
          </Button>
        </>
      )}
    </section>
  );
}
