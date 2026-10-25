import type { TopicId } from "./types";

/** The real editorial photo for a category, e.g. `photo-skincare`. */
export const topicPhoto = (id: TopicId) => `photo-${id}`;
