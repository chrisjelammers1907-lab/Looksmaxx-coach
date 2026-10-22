import type { PostSound } from "./types";

export const sounds = [
  {
    id: "sound-golden",
    title: "Golden hour",
    mood: "Warm keys · a slower afternoon",
    bpm: 80,
    duration: 12,
    color: "golden",
  },
  {
    id: "sound-after",
    title: "After hours",
    mood: "Soft pulse · a little confidence",
    bpm: 100,
    duration: 9.6,
    color: "after",
  },
  {
    id: "sound-soft",
    title: "Soft focus",
    mood: "Airy notes · room to breathe",
    bpm: 64,
    duration: 15,
    color: "soft",
  },
] as const;

export const findSound = (id?: string) => sounds.find((s) => s.id === id);
export const newPostSound = (id: string): PostSound => ({
  id,
  volume: 0.65,
  originalVolume: 0,
});

// A single audible post/preview at a time, across every mounted feed card.
export function claimPlayback(...allowed: (HTMLMediaElement | null)[]) {
  document
    .querySelectorAll<HTMLMediaElement>("audio, video")
    .forEach((node) => {
      if (!allowed.includes(node)) node.pause();
    });
}
