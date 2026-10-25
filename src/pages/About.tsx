import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Heart,
  LockKeyhole,
} from "lucide-react";
import { asset } from "../lib/domain";
export default function AboutPage() {
  return (
    <article className="about-page">
      <header className="about-hero">
        <div>
          <span className="eyebrow">ABOUT CHARETT</span>
          <h1>
            A little intention.
            <br />
            <em>A little more you.</em>
          </h1>
          <p>
            A personal space for style, self-care and progress—with a coach to
            talk to and a community to discover.
          </p>
          <span className="about-wordmark">C</span>
        </div>
        <img
          src={asset("campaign")}
          alt="AI fashion editorial inspiration with two fictional adults, not CHARETT customers"
        />
        <span className="hero-image-credit">
          AI editorial · fictional inspiration
        </span>
      </header>
      <section className="about-story">
        <span className="eyebrow">WHY WE’RE HERE</span>
        <h2>
          Good guidance should make room for <em>you.</em>
        </h2>
        <p>
          Looking after yourself can bring together a lot of little decisions:
          what to wear, how to build a routine, what to keep and what to try
          next. CHARETT brings those decisions into one considered space.
        </p>
        <p>
          It is for people of all genders exploring their own style and everyday
          care. Your preferences lead. There is no single ideal face, body,
          wardrobe or way to be.
        </p>
      </section>
      <section className="about-pillars">
        <div>
          <Sparkles />
          <h3>A conversation</h3>
          <p>
            Ask your coach in your own words. Keep your preferences in one
            shared profile and review suggestions before changing your plan.
          </p>
        </div>
        <div>
          <BookOpen />
          <h3>A practical starting point</h3>
          <p>
            Find beginner guides alongside tools for your routines, wardrobe,
            training and personal observations.
          </p>
        </div>
        <div>
          <Heart />
          <h3>A shared point of view</h3>
          <p>
            Discover photo and video inspiration, follow people you enjoy and
            save good ideas privately. A reference is a starting point, not a
            standard to live up to.
          </p>
        </div>
      </section>
      <section className="about-transparency">
        <LockKeyhole size={24} />
        <div>
          <span className="eyebrow">CLEAR FROM THE START</span>
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
            medication only through a doctor. Editorial images are AI
            inspiration, not real transformations.
          </p>
          <Link className="text-link" to="/categories">
            Find your starting point <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </article>
  );
}
