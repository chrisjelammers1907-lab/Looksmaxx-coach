export type TopicId =
  | "skincare"
  | "clothing"
  | "hair"
  | "gym"
  | "grooming"
  | "smile"
  | "fragrance"
  | "photos";
export type ClothingStyle = "old-money" | "dark-casual" | "minimalist";
export type Audience = "public" | "followers" | "private";
export interface Profile {
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
  topic: TopicId;
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
}
export interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  initials: string;
  followers: number;
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
  time: string;
}
export interface Photo {
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
  proposal?: string;
  applied?: boolean;
}
export interface DemoState {
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
}
