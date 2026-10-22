import type { TopicId } from "./types";

export const topicEditorial = (id: TopicId, fallback: string) =>
  id === "skincare" || id === "fragrance"
    ? "ritual"
    : id === "clothing" || id === "photos"
      ? "campaign"
      : fallback;
export const isAIEditorial = (image: string) =>
  ["campaign", "ritual", "tailoring"].includes(image);
