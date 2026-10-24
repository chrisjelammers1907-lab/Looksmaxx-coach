import { Link } from "react-router-dom";
import {
  BookOpen,
  Camera,
  ChevronRight,
  Droplets,
  Dumbbell,
  Eye,
  Scissors,
  Shirt,
  Smile,
  SprayCan,
} from "lucide-react";
import { topics } from "../lib/data";
import type { TopicId } from "../lib/types";

const icons: Record<TopicId, typeof Droplets> = {
  skincare: Droplets,
  clothing: Shirt,
  hair: Scissors,
  gym: Dumbbell,
  grooming: Eye,
  smile: Smile,
  fragrance: SprayCan,
  photos: Camera,
};

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
      <ul className="category-list" aria-label="Your eight categories">
        {topics.map((t) => {
          const Icon = icons[t.id];
          return (
            <li key={t.id}>
              <Link to={`/topics/${t.id}`} className="category-row">
                <span className="category-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
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
              <Link className="category-guide" to={`/topics/${t.id}/guide`}>
                <BookOpen size={14} aria-hidden="true" />
                Beginner’s guide
                <span className="visually-hidden"> for {t.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <figure className="category-quote">
        <blockquote>Become someone your future self thanks.</blockquote>
        <figcaption>CHARETT</figcaption>
      </figure>
    </div>
  );
}
