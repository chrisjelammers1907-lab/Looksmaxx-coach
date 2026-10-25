import { Link } from "react-router-dom";
import {
  Bath,
  BookOpen,
  Brush,
  Camera,
  ChevronRight,
  Droplets,
  Dumbbell,
  Eye,
  Moon,
  Palette,
  PersonStanding,
  Salad,
  ScanFace,
  Scissors,
  Shirt,
  Smile,
  SprayCan,
  Wind,
} from "lucide-react";
import { topicGroups, topics } from "../lib/data";
import type { TopicId } from "../lib/types";

const icons: Record<TopicId, typeof Droplets> = {
  skincare: Droplets,
  makeup: Brush,
  face: ScanFace,
  colouring: Palette,
  brows: Eye,
  smile: Smile,
  hair: Wind,
  grooming: Scissors,
  gym: Dumbbell,
  nutrition: Salad,
  body: Bath,
  sleep: Moon,
  presence: PersonStanding,
  clothing: Shirt,
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
