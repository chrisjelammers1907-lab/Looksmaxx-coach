import { describe, expect, it } from "vitest";
import fs from "node:fs";
import postcss, { type Rule } from "postcss";

const sheets = fs
  .readdirSync("src")
  .filter((f) => f.endsWith(".css"))
  .map((f) => ({
    file: f,
    root: postcss.parse(fs.readFileSync(`src/${f}`, "utf8")),
  }));

const inHoverQuery = (rule: Rule) => {
  let p: { type: string; params?: string; parent?: unknown } | undefined =
    rule.parent;
  while (p) {
    if (p.type === "atrule" && /hover:\s*hover/.test(p.params ?? ""))
      return true;
    p = p.parent as typeof p;
  }
  return false;
};

describe("touch-friendly CSS", () => {
  it("only applies :hover on devices that can really hover", () => {
    const ungated: string[] = [];
    for (const { file, root } of sheets)
      root.walkRules((rule) => {
        if (rule.selector.includes(":hover") && !inHoverQuery(rule))
          ungated.push(`${file}:${rule.source?.start?.line} ${rule.selector}`);
      });
    expect(ungated).toEqual([]);
  });
  it("never transitions all properties", () => {
    const all: string[] = [];
    for (const { file, root } of sheets)
      root.walkDecls(/^transition(-property)?$/, (d) => {
        if (/\ball\b/.test(d.value))
          all.push(`${file}:${d.source?.start?.line}`);
      });
    expect(all).toEqual([]);
  });
});
