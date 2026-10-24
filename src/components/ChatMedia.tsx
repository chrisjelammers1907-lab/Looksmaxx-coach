import { useEffect, useRef, useState } from "react";
import {
  Check,
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

export function Sticker({ id }: { id: string }) {
  const sticker = stickers.find((s) => s.id === id);
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
