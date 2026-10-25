import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { DemoState } from "./types";
import { creators, makeInitialState, seedPosts } from "./data";
import { releasePrivateMedia } from "./media";
import { autoLog } from "./training";
import { today, uid } from "./domain";
const STORAGE_KEY = "charett-demo-v1";
/** Training plans and logs persist in this browser, as the owner chose. */
const TRAINING_KEY = "charett-training-v1";
const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
function loadTraining(state: DemoState) {
  try {
    const saved = JSON.parse(localStorage.getItem(TRAINING_KEY) || "null");
    if (!isRecord(saved)) return state;
    return {
      ...state,
      trainingWeek: isRecord(saved.trainingWeek)
        ? (saved.trainingWeek as DemoState["trainingWeek"])
        : state.trainingWeek,
      trainingProgress: isRecord(saved.trainingProgress)
        ? (saved.trainingProgress as DemoState["trainingProgress"])
        : {},
      sessions: Array.isArray(saved.sessions)
        ? (saved.sessions as DemoState["sessions"])
        : [],
      workouts: Array.isArray(saved.workouts)
        ? (saved.workouts as DemoState["workouts"]).filter(
            (w) =>
              isRecord(w) &&
              typeof w.exercise === "string" &&
              typeof w.weight === "number",
          )
        : state.workouts,
      trainingSince:
        typeof saved.trainingSince === "string"
          ? saved.trainingSince
          : state.trainingSince,
    };
  } catch {
    return state;
  }
}
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
      "reposts",
    ] as const)
      if (Array.isArray(saved[key]))
        initial[key] = saved[key].filter(
          (v: unknown) =>
            typeof v === "string" &&
            (key === "following" || key === "blocked"
              ? creators.some((c) => c.id === v)
              : ids.includes(v)),
        );
    if (["old-money", "dark-casual", "minimalist"].includes(saved.style))
      initial.style = saved.style;
    initial.intake = saved.intake === true;
    // Preferences and streak counters only; never message contents.
    if (isRecord(saved.settings))
      initial.settings = {
        ...initial.settings,
        ...(saved.settings as Partial<DemoState["settings"]>),
        notifications: {
          ...initial.settings.notifications,
          ...(isRecord(saved.settings.notifications)
            ? (saved.settings.notifications as Partial<
                DemoState["settings"]["notifications"]
              >)
            : {}),
        },
      };
    if (isRecord(saved.chatStreaks))
      initial.chatStreaks = saved.chatStreaks as DemoState["chatStreaks"];
    if (isRecord(saved.routineStreak))
      initial.routineStreak = saved.routineStreak as DemoState["routineStreak"];
    if (isRecord(saved.routineLog))
      initial.routineLog = saved.routineLog as DemoState["routineLog"];
    if (isRecord(saved.chatThemes))
      initial.chatThemes = saved.chatThemes as DemoState["chatThemes"];
    if (Array.isArray(saved.customStickers))
      initial.customStickers = (
        saved.customStickers as DemoState["customStickers"]
      ).filter((st) => isRecord(st) && st.kind === "text");
  } catch {
    /* Storage is optional: a fresh local demo still works. */
  }
  const withTraining = loadTraining(initial);
  return { ...withTraining, ...autoLog(withTraining, today(), uid) };
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load);
  const [notice, setNotice] = useState("");
  const toast = useCallback((text: string) => setNotice(text), []);
  useEffect(() => {
    try {
      const {
        style,
        intake,
        likes,
        saved,
        following,
        blocked,
        reports,
        reposts,
        settings,
        chatStreaks,
        routineStreak,
        routineLog,
        chatThemes,
        customStickers,
      } = state;
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
          reposts: reposts.filter((i) => ids.includes(i)),
          settings,
          chatStreaks,
          routineStreak,
          routineLog,
          chatThemes,
          // Photo stickers stay in this tab like other private uploads.
          customStickers: customStickers.filter((st) => st.kind === "text"),
        }),
      );
    } catch {
      /* No sensitive state is persisted. */
    }
  }, [state]);
  const { trainingWeek, trainingProgress, sessions, workouts, trainingSince } =
    state;
  const { theme, textSize } = state.settings;
  // Light, dark or follow the device; the choice is applied to <html>.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#0b2a22" : "#123D32");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
  }, [textSize]);
  useEffect(() => {
    try {
      localStorage.setItem(
        TRAINING_KEY,
        JSON.stringify({
          trainingWeek,
          trainingProgress,
          sessions,
          workouts,
          trainingSince,
        }),
      );
    } catch {
      /* The plan still works for this session without storage. */
    }
  }, [trainingWeek, trainingProgress, sessions, workouts, trainingSince]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => () => releasePrivateMedia(), []);
  const reset = () => {
    releasePrivateMedia();
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TRAINING_KEY);
    } catch {
      /* Nothing stored. */
    }
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
