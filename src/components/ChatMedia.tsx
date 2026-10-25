import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Flame,
  Heart,
  Crown,
  Droplets,
  Dumbbell,
  Leaf,
  Moon,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { privateMediaUrl } from "../lib/media";
import { useDemo } from "../lib/store";
import { uid } from "../lib/domain";
import type { CustomSticker } from "../lib/types";
import { Button, Field, Modal } from "./ui";

/** Original CHARETT sticker set, drawn with type and palette tokens. */
export const stickers = [
  { id: "fit-check", label: "Fit check", icon: Check },
  { id: "glow-up", label: "Glow up", icon: Sparkles },
  { id: "new-pr", label: "New PR", icon: Dumbbell },
  { id: "clean", label: "Clean", icon: Leaf },
  { id: "soft-life", label: "Soft life", icon: Moon },
  { id: "hydrate", label: "Hydrate", icon: Droplets },
  { id: "main-character", label: "Main character", icon: Crown },
  { id: "rest-day", label: "Rest day", icon: Moon },
] as const;

/** Unlocked with a 3-day chat streak. */
export const streakStickers = [
  { id: "streak-on-fire", label: "On fire", icon: Flame },
  { id: "streak-no-days-off", label: "No days off", icon: Dumbbell },
  { id: "streak-ride-or-die", label: "Ride or die", icon: Heart },
] as const;

export function Sticker({ id }: { id: string }) {
  const { state } = useDemo();
  const custom = state.customStickers.find((s) => s.id === id);
  if (custom)
    return custom.kind === "photo" ? (
      <span className="sticker sticker-photo">
        <img src={custom.image} alt="Custom photo sticker" />
      </span>
    ) : (
      <span className={`sticker sticker-text-${custom.style || "forest"}`}>
        {custom.text}
      </span>
    );
  const sticker = [...stickers, ...streakStickers].find((s) => s.id === id);
  if (!sticker) return null;
  const Icon = sticker.icon;
  return (
    <span className={`sticker sticker-${sticker.id}`}>
      <Icon size={16} strokeWidth={2} aria-hidden="true" />
      {sticker.label}
    </span>
  );
}

const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

export function VoiceNote({ src, seconds }: { src: string; seconds: number }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const bars = [6, 12, 18, 10, 16, 22, 14, 8, 18, 12, 20, 9, 15, 11, 6];
  return (
    <div className="voice-note">
      <button
        type="button"
        aria-label={`${playing ? "Pause" : "Play"} voice message`}
        onClick={() =>
          playing ? audio.current?.pause() : audio.current?.play()
        }
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <span className="voice-bars" aria-hidden="true">
        {bars.map((h, i) => (
          <i
            key={i}
            style={{ height: h }}
            className={i / bars.length < progress ? "played" : ""}
          />
        ))}
      </span>
      <small>{time(seconds)}</small>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) =>
          setProgress(e.currentTarget.currentTime / Math.max(seconds, 0.1))
        }
      />
    </div>
  );
}

/** Records a voice note with the browser microphone; nothing leaves the tab. */
export function useVoiceRecorder(
  onDone: (note: { src: string; seconds: number }) => void,
  onError: (message: string) => void,
) {
  const recorder = useRef<MediaRecorder | null>(null);
  const started = useRef(0);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(
      () => setElapsed((Date.now() - started.current) / 1000),
      250,
    );
    return () => clearInterval(timer);
  }, [recording]);
  useEffect(() => () => recorder.current?.stop(), []);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const chunks: Blob[] = [];
      const media = new MediaRecorder(stream);
      media.ondataavailable = (e) => chunks.push(e.data);
      media.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const seconds = (Date.now() - started.current) / 1000;
        setRecording(false);
        if (seconds < 0.5) return;
        onDone({
          src: privateMediaUrl(new Blob(chunks, { type: media.mimeType })),
          seconds,
        });
      };
      recorder.current = media;
      started.current = Date.now();
      setElapsed(0);
      media.start();
      setRecording(true);
    } catch {
      onError(
        "The microphone is not available here. Allow microphone access in your browser and try again.",
      );
    }
  };
  const stop = () =>
    recorder.current?.state === "recording" && recorder.current.stop();
  const cancel = () => {
    if (!recorder.current) return;
    recorder.current.onstop = () => setRecording(false);
    recorder.current.stream.getTracks().forEach((t) => t.stop());
    if (recorder.current.state === "recording") recorder.current.stop();
  };
  return { recording, elapsed: time(elapsed), start, stop, cancel };
}

const textStyles: NonNullable<CustomSticker["style"]>[] = [
  "forest",
  "champagne",
  "ivory",
  "outline",
];

/** Makes a sticker from your own words or a photo, cut to a rounded tile. */
export function StickerMaker({
  onDone,
  onClose,
}: {
  onDone: (id: string) => void;
  onClose: () => void;
}) {
  const { update } = useDemo();
  const [mode, setMode] = useState<"text" | "photo">("text");
  const [text, setText] = useState("");
  const [style, setStyle] = useState<CustomSticker["style"]>("forest");
  const [image, setImage] = useState("");
  const cut = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 320;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const side = Math.min(img.width, img.height);
        ctx.beginPath();
        ctx.roundRect(8, 8, size - 16, size - 16, 64);
        ctx.clip();
        ctx.drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          8,
          8,
          size - 16,
          size - 16,
        );
        setImage(canvas.toDataURL("image/webp", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const preview: CustomSticker =
    mode === "text"
      ? { id: "preview", kind: "text", text: text || "Your words", style }
      : { id: "preview", kind: "photo", image };
  return (
    <Modal title="Create a sticker" onClose={onClose}>
      <div className="segmented" role="tablist" aria-label="Sticker type">
        {(["text", "photo"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? "active" : ""}
            onClick={() => setMode(m)}
          >
            {m === "text" ? "Text" : "Photo"}
          </button>
        ))}
      </div>
      <div className="sticker-preview">
        {preview.kind === "photo" && !image ? (
          <span className="muted small-text">Choose a photo to cut out.</span>
        ) : preview.kind === "photo" ? (
          <span className="sticker sticker-photo">
            <img src={image} alt="Sticker preview" />
          </span>
        ) : (
          <span className={`sticker sticker-text-${style}`}>
            {preview.text}
          </span>
        )}
      </div>
      {mode === "text" ? (
        <>
          <Field
            label="Sticker text"
            maxLength={24}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="chip-row" aria-label="Sticker style">
            {textStyles.map((st) => (
              <button
                key={st}
                type="button"
                className="chip"
                aria-pressed={style === st}
                onClick={() => setStyle(st)}
              >
                {st[0].toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </>
      ) : (
        <label className="upload">
          <Camera size={20} aria-hidden="true" />
          <span>Choose a photo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Sticker photo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) cut(file);
            }}
          />
        </label>
      )}
      <div className="modal-actions">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={mode === "text" ? !text.trim() : !image}
          onClick={() => {
            const sticker: CustomSticker = {
              ...preview,
              id: uid(),
              text: mode === "text" ? text.trim() : undefined,
            };
            update((s) => ({
              ...s,
              customStickers: [...s.customStickers, sticker],
            }));
            onDone(sticker.id);
          }}
        >
          Save and send
        </Button>
      </div>
    </Modal>
  );
}

/** A live camera on desktop; phones use their own camera app instead. */
export function CameraCapture({
  onPhoto,
  onClose,
  onError,
}: {
  onPhoto: (dataUrl: string) => void;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const callbacks = useRef({ onClose, onError });
  useEffect(() => {
    callbacks.current = { onClose, onError };
  });
  useEffect(() => {
    let stream: MediaStream | undefined;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" } })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        if (video.current) {
          video.current.srcObject = s;
          void video.current.play();
          setReady(true);
        }
      })
      .catch(() => {
        callbacks.current.onError(
          "The camera is not available here. Allow camera access in your browser and try again.",
        );
        callbacks.current.onClose();
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  return (
    <Modal title="Camera" onClose={onClose}>
      <div className="camera-frame">
        <video ref={video} playsInline muted aria-label="Camera preview" />
      </div>
      <div className="modal-actions">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!ready}
          onClick={() => {
            const v = video.current;
            if (!v) return;
            const canvas = document.createElement("canvas");
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            canvas.getContext("2d")!.drawImage(v, 0, 0);
            onPhoto(canvas.toDataURL("image/jpeg", 0.88));
            onClose();
          }}
        >
          <Camera size={16} /> Take photo
        </Button>
      </div>
    </Modal>
  );
}
