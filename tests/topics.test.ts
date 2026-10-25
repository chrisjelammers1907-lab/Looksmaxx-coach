import { describe, expect, it } from "vitest";
import { makeInitialState, topicGroups, topics } from "../src/lib/data";

describe("categories", () => {
  it("every topic has a group and a unique number", () => {
    expect(topics).toHaveLength(16);
    expect(topics.map((t) => t.number)).toEqual(
      Array.from({ length: 16 }, (_, i) => String(i + 1).padStart(2, "0")),
    );
    const groups = topicGroups.map((g) => g.id);
    for (const t of topics) expect(groups).toContain(t.group);
  });

  it("groups are in order", () => {
    expect(topicGroups.map((g) => g.id)).toEqual([
      "face",
      "hair",
      "body",
      "style",
      "progress",
    ]);
    // Topics are listed group by group, so the category page reads in order.
    const order = topics.map((t) =>
      topicGroups.findIndex((g) => g.id === t.group),
    );
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("has the new categories and keeps the existing ids", () => {
    const ids = topics.map((t) => t.id);
    for (const id of [
      "makeup",
      "face",
      "colouring",
      "brows",
      "nutrition",
      "body",
      "sleep",
      "presence",
      "skincare",
      "clothing",
      "hair",
      "gym",
      "grooming",
      "smile",
      "fragrance",
      "photos",
    ])
      expect(ids).toContain(id);
    expect(topics.find((t) => t.id === "grooming")?.title).toBe(
      "Beard & shaving",
    );
    expect(topics.find((t) => t.id === "face")?.title).toBe("Face structure");
  });

  it("every new category starts with a routine and products", () => {
    const state = makeInitialState();
    for (const id of [
      "makeup",
      "face",
      "colouring",
      "brows",
      "body",
      "sleep",
      "presence",
    ]) {
      expect(state.routines.some((r) => r.topic === id)).toBe(true);
      expect(
        state.items.filter((i) => i.topic === id).length,
      ).toBeGreaterThanOrEqual(2);
    }
  });
});
