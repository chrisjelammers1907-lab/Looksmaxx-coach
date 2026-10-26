import { useEffect, useRef, useState } from "react";
import { Check, Music2, Pause, Play, X } from "lucide-react";
import { asset } from "../lib/domain";
import { claimPlayback, findSound, newPostSound, sounds } from "../lib/sounds";
import type { PostSound } from "../lib/types";
import { Button } from "./ui";

export function SoundPicker({
  value,
  onChange,
  video = false,
}: {
  value?: PostSound;
  onChange: (value?: PostSound) => void;
  video?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const player = useRef<HTMLAudioElement>(null);
  const selected = findSound(value?.id);
  useEffect(() => {
    const audio = player.current;
    const stop = () => {
      if (document.hidden) audio?.pause();
    };
    document.addEventListener("visibilitychange", stop);
    return () => {
      audio?.pause();
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);
  return (
    <section className="sound-picker" aria-label="Post sound">
      <div className="sound-picker-heading">
        <span className="sound-symbol">
          <Music2 size={20} />
        </span>
        <div>
          <strong>
            {selected ? selected.title : "Give your post a mood."}
          </strong>
          <p>
            {selected
              ? "Original CHARETT demo sound"
              : "Add a sound to your photo or video. Optional, always."}
          </p>
        </div>
        <Button
          variant="secondary small"
          type="button"
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            player.current?.pause();
          }}
        >
          {selected ? "Change sound" : "Add sound"}
        </Button>
      </div>
      {open && (
        <div className="sound-library">
          <div className="sound-library-intro">
            <p>
              Three original instrumental loops. Preview a mood, then make it
              yours.
            </p>
          </div>
          {sounds.map((sound) => (
            <div
              className={`sound-option ${sound.color} ${value?.id === sound.id ? "selected" : ""}`}
              key={sound.id}
            >
              <button
                className="sound-preview"
                type="button"
                aria-label={`${preview === sound.id ? "Pause" : "Preview"} ${sound.title}`}
                onClick={async () => {
                  const audio = player.current;
                  if (!audio) return;
                  setError("");
                  if (preview === sound.id) {
                    audio.pause();
                    return;
                  }
                  audio.src = asset(sound.id);
                  audio.volume = value?.volume ?? 0.65;
                  claimPlayback(audio);
                  try {
                    await audio.play();
                    setPreview(sound.id);
                  } catch {
                    setError("This sound could not play. Try again.");
                  }
                }}
              >
                {preview === sound.id ? (
                  <Pause size={17} />
                ) : (
                  <Play size={17} />
                )}
              </button>
              <div className="sound-option-info">
                <strong>{sound.title}</strong>
                <small>{sound.mood}</small>
                <span>
                  {sound.bpm} BPM · {sound.duration}s · original demo audio
                </span>
              </div>
              <button
                className="sound-select"
                type="button"
                aria-label={`Use ${sound.title}`}
                aria-pressed={value?.id === sound.id}
                onClick={() => {
                  onChange(
                    value?.id === sound.id ? undefined : newPostSound(sound.id),
                  );
                  player.current?.pause();
                }}
              >
                {value?.id === sound.id ? (
                  <Check size={17} />
                ) : (
                  <Music2 size={17} />
                )}
                <span>{value?.id === sound.id ? "Selected" : "Use sound"}</span>
              </button>
            </div>
          ))}
          <p className="small-text">
            Demo library · Original synthesized instrumentals, not a commercial
            music catalogue.
          </p>
        </div>
      )}
      {selected && value && (
        <div className="sound-mix">
          <label className="field">
            <span>Added sound volume · {Math.round(value.volume * 100)}%</span>
            <input
              type="range"
              aria-label="Added sound volume"
              min="0"
              max="1"
              step="0.05"
              value={value.volume}
              onChange={(e) => {
                onChange({ ...value, volume: Number(e.target.value) });
                if (player.current)
                  player.current.volume = Number(e.target.value);
              }}
            />
          </label>
          {video && (
            <label className="field">
              <span>
                Original video volume · {Math.round(value.originalVolume * 100)}
                %
              </span>
              <input
                type="range"
                aria-label="Original video volume"
                min="0"
                max="1"
                step="0.05"
                value={value.originalVolume}
                onChange={(e) =>
                  onChange({ ...value, originalVolume: Number(e.target.value) })
                }
              />
            </label>
          )}
          <button
            className="text-button"
            type="button"
            onClick={() => {
              onChange(undefined);
              player.current?.pause();
            }}
          >
            <X size={14} /> Remove sound
          </button>
        </div>
      )}
      <audio
        ref={player}
        preload="none"
        onPause={() => setPreview("")}
        onEnded={() => setPreview("")}
        onError={() => {
          setPreview("");
          setError("This sound could not load. Try another sound.");
        }}
      />
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
