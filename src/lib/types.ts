export type TopicId =
  | "skincare"
  | "makeup"
  | "face"
  | "colouring"
  | "brows"
  | "smile"
  | "hair"
  | "grooming"
  | "gym"
  | "nutrition"
  | "body"
  | "sleep"
  | "presence"
  | "clothing"
  | "fragrance"
  | "photos";
export type TopicGroup = "face" | "hair" | "body" | "style" | "progress";
export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type ClothingStyle = "old-money" | "dark-casual" | "minimalist";
export type Audience = "public" | "followers" | "private";
export interface Profile {
  visibility: "public" | "private";
  name: string;
  handle: string;
  bio: string;
  goals: string;
  preferences: string;
  restrictions: string;
  country: string;
  currency: string;
  budget: number;
  coachStyle: "supportive" | "direct";
  messageRequests: boolean;
  photo?: string;
}
export interface Item {
  id: string;
  topic: TopicId;
  name: string;
  brand: string;
  store: string;
  price: number | null;
  currency: string;
  checkedAt: string;
  url: string;
  image: string;
  size: string;
  notes: string;
  tags: string;
}
export interface Routine {
  id: string;
  topic: TopicId;
  title: string;
  time: string;
  schedule: string;
  steps: string[];
  /** Owned products used in this routine. */
  productIds?: string[];
  /** Optional product per step index. */
  stepProducts?: Record<number, string>;
}
export interface Outfit {
  id: string;
  title: string;
  itemIds: string[];
  style: ClothingStyle;
  occasion: string;
  season: string;
  notes: string;
  wornPhoto?: string;
}
export interface Post {
  id: string;
  author: string;
  topic: TopicId | "";
  title: string;
  body: string;
  image: string;
  items: Item[];
  steps: string[];
  audience: Audience;
  style: string;
  occasion: string;
  season: string;
  tags: string;
  date: string;
  media?: FeedMedia;
  sound?: PostSound;
  format?: "photo" | "reel";
  /** Editorial asset keys only; private uploads remain in media. */
  slides?: string[];
  /** Drafts are visible to their author only and never shared. */
  draft?: boolean;
}
export interface PostSound {
  id: string;
  volume: number;
  originalVolume: number;
}
export interface FeedMedia {
  kind: "image" | "video";
  src: string;
  width: number;
  height: number;
  origin: "editorial" | "private-upload";
  label: string;
  poster?: string;
}
export interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  initials: string;
  followers: number;
  following: number;
  likes: number;
}
export interface Comment {
  id: string;
  author: string;
  text: string;
}
export interface CardRef {
  kind: "post" | "outfit" | "product" | "routine";
  id: string;
}
export interface Message {
  id: string;
  author: string;
  text: string;
  card?: CardRef;
  /** Session-only attachments; never persisted or delivered. */
  photo?: string;
  sticker?: string;
  audio?: { src: string; seconds: number };
  time: string;
  date?: string;
}
export interface Photo {
  audience?: Audience;
  mediaKind: "real" | "inspiration";
  id: string;
  data: string;
  topic: TopicId;
  date: string;
  note: string;
  tag: string;
}
export interface Workout {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}
export interface PlannedSet {
  reps: number;
  weight: number;
}
export interface PlannedExercise {
  id: string;
  name: string;
  sets: PlannedSet[];
}
/** A training day on the weekly schedule, e.g. "Upper" on Monday. */
export interface TrainingDay {
  name: string;
  exercises: PlannedExercise[];
  /** Repeats every week; otherwise it applies to `date` only. */
  repeat: boolean;
  date?: string;
}
export interface SetProgress extends PlannedSet {
  done: boolean;
}
export interface TrainingSession {
  id: string;
  date: string;
  name: string;
  status: "done" | "skipped";
  exercises: { name: string; sets: SetProgress[] }[];
}
/** Optional nutrients, keyed as in `extraNutrients` (lib/nutrition). */
export type ExtraNutrients = Partial<Record<string, number>>;
export interface Macros {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}
export interface Food extends Macros {
  id: string;
  date: string;
  name: string;
  brand?: string;
  /** Amount eaten in grams, when known. */
  grams?: number;
  barcode?: string;
  source: "manual" | "scan";
  extra?: ExtraNutrients;
  /** Values per 100 g from a scanned label, so the amount can rescale. */
  per100?: Macros & { extra?: ExtraNutrients };
}
export interface NutritionTargets extends Macros {
  extra?: ExtraNutrients;
}
export interface WeightEntry {
  id: string;
  date: string;
  kg: number;
}
export interface Goal {
  id: string;
  text: string;
  /** Legacy cadence from coach proposals; `repeat` takes precedence. */
  cadence: "Daily" | "Weekly";
  done: boolean;
  /** Optional due date (YYYY-MM-DD). */
  due?: string;
  repeat?: "none" | "daily" | "weekly";
  /** For repeating tasks: the last day they were ticked off. */
  doneOn?: string;
}
export interface ChatMessage {
  id: string;
  author: "you" | "coach";
  text: string;
  photo?: string;
  file?: { name: string; size: number; type: string };
  proposal?: string;
  applied?: boolean;
  guide?: TopicId;
}
export interface Story {
  id: string;
  author: string;
  /** Editorial asset key; omitted for text-only stories. */
  image?: string;
  background?: "forest" | "ivory" | "champagne";
  text?: string;
  time: string;
}
export interface CustomSticker {
  id: string;
  kind: "text" | "photo";
  text?: string;
  style?: "forest" | "champagne" | "ivory" | "outline";
  /** Session-only data URL for photo stickers. */
  image?: string;
}
export interface Streak {
  count: number;
  /** Last day (YYYY-MM-DD) that kept the streak alive. */
  last: string;
}
export type PlanId = "free" | "plus" | "signature";
export interface Subscription {
  plan: PlanId;
  billing: "monthly" | "yearly";
  /** Date the current paid plan started (simulated). */
  since?: string;
}
export type ThemeChoice = "system" | "light" | "dark";
export interface AppSettings {
  theme: ThemeChoice;
  textSize: "default" | "large";
  weightUnit: "kg" | "lb";
  heightUnit: "cm" | "ft";
  notifications: {
    likes: boolean;
    comments: boolean;
    messages: boolean;
    stories: boolean;
    streaks: boolean;
    training: boolean;
    quietHours: boolean;
  };
  whoCanMessage: "everyone" | "followers" | "nobody";
  hiddenWords: string;
}
export interface DemoState {
  approvedFollowers: string[];
  incomingRequests: string[];
  profile: Profile;
  intake: boolean;
  style: ClothingStyle;
  items: Item[];
  routines: Routine[];
  outfits: Outfit[];
  posts: Post[];
  likes: string[];
  saved: string[];
  following: string[];
  blocked: string[];
  reports: string[];
  comments: Record<string, Comment[]>;
  messages: Record<string, Message[]>;
  photos: Photo[];
  workouts: Workout[];
  food: Food[];
  /** Set by the person; there are no starter targets. */
  nutritionTargets: NutritionTargets | null;
  weights: WeightEntry[];
  goals: Goal[];
  schedule: Record<string, string>;
  notes: Partial<Record<TopicId, string>>;
  shortlist: string[];
  hairSaved: string[];
  chat: ChatMessage[];
  checkIn: string;
  stories: Story[];
  seenStories: string[];
  reposts: string[];
  customStickers: CustomSticker[];
  chatStreaks: Record<string, Streak>;
  routineStreak: Streak;
  /** Routine ids completed per day, for the routine streak. */
  routineLog: Record<string, string[]>;
  chatThemes: Record<string, string>;
  settings: AppSettings;
  subscription: Subscription;
  /** Coach messages, files and barcode scans used on one day. */
  coachUsage: { date: string; messages: number; files: number; scans?: number };
  trainingWeek: Partial<Record<Weekday, TrainingDay>>;
  /** Ticked sets per date, then per planned exercise id. */
  trainingProgress: Record<string, Record<string, SetProgress[]>>;
  sessions: TrainingSession[];
  /** Days before this date are never auto-logged. */
  trainingSince: string;
  notifications: Record<string, "all" | "stories" | "off">;
  muted: string[];
}
