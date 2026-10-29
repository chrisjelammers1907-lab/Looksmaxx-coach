import { useSyncExternalStore } from "react";

/**
 * One sound switch for every reel, like Instagram: reels start muted, and
 * once you turn the sound on, the next reel plays with sound too.
 */
let muted = true;
const listeners = new Set<() => void>();

export const reelSound = {
  muted: () => muted,
  set(next: boolean) {
    muted = next;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useReelMuted = () =>
  useSyncExternalStore(reelSound.subscribe, reelSound.muted, reelSound.muted);
