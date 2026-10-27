import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import TurnSequence, { turnStill } from "../components/TurnSequence";
import { DEMO } from "../lib/demo";

/** The founder's story, in his words; one chapter per screen of scroll. */
const chapters = [
  {
    title: "I always wanted to build something of my own.",
    text: "Something I believed in enough to give it my time and energy. For a long time, I just didn’t know what it would be.",
  },
  {
    title: "It started on TikTok, at the end of 2023.",
    text: "Mewing, fragrance, getting leaner. Everyone wanted to look better, but nobody agreed on what actually worked. The more I learned, the clearer it became: there was no single place to find it all, clearly and honestly.",
  },
  {
    title: "Chico. Barrett. CHARETT.",
    text: "The faces of that first wave were models like Francisco “Chico” Lachowski and Jordan Barrett. I took a piece of each, to remember where this began.",
  },
  {
    title: "Too many promises. Too little proof.",
    text: "Unproven methods sold as facts, by people with little to show for them. When you’re starting out, it’s hard to tell what works from what’s a trend or a sales pitch.",
  },
  {
    title: "For anyone who looks in the mirror and wants more.",
    text: "I’ve stood there too, and in some ways I still do. CHARETT is for people who are willing to put in the work, whether it’s their first day or their fifth year.",
  },
  {
    title: "Honest about what works. Clear about what doesn’t.",
    text: "No miracle fixes, no face scores. Just what you can do, what you can’t, and how to start. Because in the end, it’s not only about how you look. It’s about how you see yourself.",
  },
];

const values = [
  {
    title: "A conversation",
    text: "Ask your coach in your own words. Keep your preferences in one shared profile and review suggestions before changing your plan.",
  },
  {
    title: "A practical starting point",
    text: "Find beginner guides alongside tools for your routines, wardrobe, training and personal observations.",
  },
  {
    title: "A shared point of view",
    text: "Discover photo and video inspiration, follow people you enjoy and save good ideas privately. A reference is a starting point, not a standard to live up to.",
  },
];

/** Motion is on unless the visitor asked for less of it or to save data. */
const wantsMotion = () =>
  typeof matchMedia === "function" &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches &&
  !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData;

export default function AboutPage() {
  const story = useRef<HTMLElement>(null);
  const [motion] = useState(wantsMotion);
  // How far the reader is through the story, 0–1.
  const progress = useCallback(() => {
    const node = story.current;
    if (!node) return 0;
    const box = node.getBoundingClientRect();
    const run = box.height - innerHeight;
    return run > 0 ? Math.min(1, Math.max(0, -box.top / run)) : 0;
  }, []);

  // The film reaches past the page's padding, so it meets the masthead and
  // both sides of the app frame.
  useLayoutEffect(() => {
    const node = story.current;
    const main = node?.closest("main");
    if (!motion || !node || !main) return;
    const bleed = () => {
      const css = getComputedStyle(main);
      node.style.setProperty("--bleed-top", css.paddingTop);
      node.style.setProperty("--bleed-left", css.paddingLeft);
      node.style.setProperty("--bleed-right", css.paddingRight);
    };
    bleed();
    addEventListener("resize", bleed);
    return () => removeEventListener("resize", bleed);
  }, [motion]);

  return (
    <article className={`about-page ${motion ? "has-motion" : "is-still"}`}>
      <section
        ref={story}
        className="about-story"
        aria-label="The story of CHARETT"
      >
        <div className="about-turn">
          {motion ? (
            <>
              <TurnSequence progress={progress} />
              <p className="about-wordmark" aria-hidden="true">
                CHARETT
              </p>
            </>
          ) : (
            <img src={turnStill()} alt="" />
          )}
        </div>
        <div className="about-chapters">
          {motion && <div className="story-intro" aria-hidden="true" />}
          {chapters.map((c, i) => {
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <div key={c.title} className="story-chapter" data-chapter={i}>
                <div>
                  <Heading>{c.title}</Heading>
                  <p>{c.text}</p>
                  {i === chapters.length - 1 && (
                    <Link className="text-link" to="/categories">
                      Find your starting point <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="about-values" aria-label="What CHARETT offers">
        {values.map((v) => (
          <div className="about-value" key={v.title}>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </section>
      <section className="about-transparency">
        <div>
          <h2>
            {DEMO ? "Honest about what this is." : "Your data, your call."}
          </h2>
          {DEMO && (
            <p>
              This is an interactive preview. Creators, brands, ads and social
              activity are fictional. The coach gives sample replies, and
              payments, shopping and accounts are simulated.
            </p>
          )}
          <p>
            Photos, profile edits, your journal and messages stay in this
            browser tab and clear on reload. Your settings, streaks, plan,
            training, food and weight logs are saved in this browser only —
            never on a server.
          </p>
          <p>
            The guides are general education, not medical advice. Hormones or
            medication only through a doctor. Editorial photos and video are
            licensed stock of models, not real transformations.
          </p>
          <Link className="text-link" to="/categories">
            Find your starting point <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </article>
  );
}
