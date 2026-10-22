import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { topics } from "../lib/data";
import { asset } from "../lib/domain";
import { isAIEditorial, topicEditorial } from "../lib/editorial";
export default function CategoriesPage() {
  return (
    <div className="categories-page">
      <header className="category-intro">
        <div className="category-intro-copy">
          <span className="eyebrow">
            A LITTLE KNOWLEDGE. YOUR OWN DIRECTION.
          </span>
          <h1>
            Your tools for
            <br />
            <em>style, care & progress.</em>
          </h1>
          <p>
            Choose an area to build routines, organise what you own and keep
            track of changes. Every category has a beginner’s guide, always
            there when you need it.
          </p>
          <span className="category-intro-count">
            01 — 08 <i /> A considered collection of everyday tools
          </span>
        </div>
        <figure className="category-intro-art">
          <img
            src={asset("ritual")}
            alt="AI editorial still life with fictional cosmetics and fragrance on warm stone"
          />
          <figcaption>AI editorial inspiration</figcaption>
        </figure>
      </header>
      <section className="category-grid" aria-label="Your eight categories">
        {topics.map((t) => (
          <article className={`category-tile tile-${t.id}`} key={t.id}>
            <Link to={`/topics/${t.id}`} className="category-tile-image">
              <img
                src={asset(topicEditorial(t.id, t.image))}
                alt={`${t.title} editorial reference`}
              />
              <span>{t.number}</span>
              <ArrowUpRight size={22} />
              {isAIEditorial(topicEditorial(t.id, t.image)) && (
                <small className="editorial-art-credit">
                  AI editorial inspiration
                </small>
              )}
            </Link>
            <div className="category-tile-copy">
              <Link to={`/topics/${t.id}`}>
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
              </Link>
              <Link className="guide-text-link" to={`/topics/${t.id}/guide`}>
                <BookOpen size={15} /> Beginner’s guide{" "}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </section>
      <div className="category-closing">
        <span className="eyebrow">START WHERE YOU ARE</span>
        <p>
          You don’t need to change everything.
          <br />
          <em>Choose one thing that matters to you.</em>
        </p>
      </div>
    </div>
  );
}
