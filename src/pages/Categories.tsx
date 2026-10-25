import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { topicGroups, topics } from "../lib/data";
import { asset } from "../lib/domain";
import { topicPhoto } from "../lib/editorial";

export default function CategoriesPage() {
  return (
    <div className="categories-page">
      <header className="categories-header">
        <span className="eyebrow">{topics.length} categories</span>
        <h1>Categories</h1>
        <p>
          Routines, tools and a beginner’s guide for every part of your look.
        </p>
      </header>
      {topicGroups.map((group) => (
        <section
          className="category-group"
          key={group.id}
          aria-labelledby={`group-${group.id}`}
        >
          <h2 id={`group-${group.id}`}>{group.title}</h2>
          <ul className="category-list">
            {topics
              .filter((t) => t.group === group.id)
              .map((t) => {
                return (
                  <li key={t.id}>
                    <Link to={`/topics/${t.id}`} className="category-row">
                      <img
                        className="category-photo"
                        src={asset(topicPhoto(t.id))}
                        alt=""
                        loading="lazy"
                      />
                      <span className="category-text">
                        <strong>{t.title}</strong>
                        <small>{t.subtitle}</small>
                      </span>
                      <ChevronRight
                        className="category-chevron"
                        size={20}
                        aria-hidden="true"
                      />
                    </Link>
                    <Link
                      className="category-guide"
                      to={`/topics/${t.id}/guide`}
                    >
                      <BookOpen size={14} aria-hidden="true" />
                      Guide
                      <span className="visually-hidden"> for {t.title}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
      <figure className="category-quote">
        <blockquote>Become someone your future self thanks.</blockquote>
        <figcaption>CHARETT</figcaption>
      </figure>
    </div>
  );
}
