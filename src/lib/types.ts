export type TopicId =
  | "skincare"
  | "clothing"
  | "hair"
  | "gym"
  | "grooming"
  | "smile"
  | "fragrance"
  | "photos";
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
  calories: number;
  protein: number;
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
export interface Food {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  source: string;
}
export interface Goal {
  id: string;
  text: string;
  cadence: "Daily" | "Weekly";
  done: boolean;
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
  trainingWeek: Partial<Record<Weekday, TrainingDay>>;
  /** Ticked sets per date, then per planned exercise id. */
  trainingProgress: Record<string, Record<string, SetProgress[]>>;
  sessions: TrainingSession[];
  /** Days before this date are never auto-logged. */
  trainingSince: string;
  notifications: Record<string, "all" | "stories" | "off">;
  muted: string[];
}
