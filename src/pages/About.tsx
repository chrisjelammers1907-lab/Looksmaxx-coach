import { Fragment, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { asset } from "../lib/domain";

/** Each word is its own span, so the statement can light up as it is read. */
function Words({ text, emphasis }: { text: string; emphasis?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word" style={{ "--i": i } as CSSProperties}>
            {word === emphasis ? <em>{word}</em> : word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

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

export default function AboutPage() {
  return (
    <article className="about-page">
      <header className="about-stage">
        <div className="about-stage-inner">
          <div className="about-stage-copy">
            <h1>
              A little intention.
              <br />
              <em>A little more you.</em>
            </h1>
            <p>
              A personal space for style, self-care and progress—with a coach to
              talk to and a community to discover.
            </p>
          </div>
          <figure className="about-stage-photo">
            <img src={asset("photo-home-hero")} alt="" />
          </figure>
        </div>
      </header>
      <section className="about-manifesto">
        <h2 className="about-statement">
          <Words
            text="Good guidance should make room for you."
            emphasis="you."
          />
        </h2>
        <div className="about-manifesto-body">
          <p>
            Looking after yourself can bring together a lot of little decisions:
            what to wear, how to build a routine, what to keep and what to try
            next. CHARETT brings those decisions into one considered space.
          </p>
          <p>
            It is for people of all genders exploring their own style and
            everyday care. Your preferences lead. There is no single ideal face,
            body, wardrobe or way to be.
          </p>
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
            Made to explore.
            <br />
            <em>Honest about the demo.</em>
          </h2>
          <p>
            This is an interactive preview. Creators, brands, ads and social
            activity are fictional. The coach gives sample replies, and
            payments, shopping and accounts are simulated.
          </p>
          <p>
            Photos, profile edits, your journal and messages stay in this
            browser tab and clear on reload. Your settings, streaks, plan,
            training, food and weight logs are saved in this browser only —
            never on a server.
          </p>
          <p>
            The guides are general education, not medical advice. Hormones or
            medication only through a doctor. Editorial photos are licensed
            stock images of models, not real transformations.
          </p>
          <Link className="text-link" to="/categories">
            Find your starting point <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </article>
  );
}
