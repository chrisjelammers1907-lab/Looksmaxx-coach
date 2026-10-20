import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { DemoState } from "./types";
import { makeInitialState, seedPosts } from "./data";
import { releasePrivateMedia } from "./media";
const STORAGE_KEY = "charett-demo-v1";
export type Patch = (state: DemoState) => DemoState;
interface Store {
  state: DemoState;
  update: (patch: Patch) => void;
  reset: () => void;
  toast: (text: string) => void;
}
const Context = createContext<Store | null>(null);
function load(): DemoState {
  const initial = makeInitialState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const ids = seedPosts.map((p) => p.id);
    for (const key of [
      "likes",
      "saved",
      "following",
      "blocked",
      "reports",
    ] as const)
      if (Array.isArray(saved[key]))
        initial[key] = saved[key].filter(
          (v: unknown) =>
            typeof v === "string" &&
            (key === "following" || key === "blocked"
              ? ["mira", "james", "noor"].includes(v)
              : ids.includes(v)),
        );
    if (["old-money", "dark-casual", "minimalist"].includes(saved.style))
      initial.style = saved.style;
    initial.intake = saved.intake === true;
  } catch {
    /* Storage is optional: a fresh local demo still works. */
  }
  return initial;
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load);
  const [notice, setNotice] = useState("");
  const toast = useCallback((text: string) => setNotice(text), []);
  useEffect(() => {
    try {
      const { style, intake, likes, saved, following, blocked, reports } =
        state;
      const ids = seedPosts.map((p) => p.id);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          style,
          intake,
          likes: likes.filter((i) => ids.includes(i)),
          saved: saved.filter((i) => ids.includes(i)),
          following,
          blocked,
          reports: reports.filter((i) => ids.includes(i)),
        }),
      );
    } catch {
      /* No sensitive state is persisted. */
    }
  }, [state]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => () => releasePrivateMedia(), []);
  const reset = () => {
    releasePrivateMedia();
    localStorage.removeItem(STORAGE_KEY);
    setState(makeInitialState());
    toast("Demo reset. Private session content removed.");
  };
  return (
    <Context.Provider value={{ state, update: setState, reset, toast }}>
      {children}
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice}
      </div>
    </Context.Provider>
  );
}
export const useDemo = () => {
  const value = useContext(Context);
  if (!value) throw new Error("DemoProvider is required");
  return value;
};
export function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}
