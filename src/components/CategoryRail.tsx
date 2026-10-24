import { NavLink } from "react-router-dom";
import { topics } from "../lib/data";
import { asset } from "../lib/domain";
import { topicEditorial } from "../lib/editorial";

const names = [
  "Skincare",
  "Clothing & Style",
  "Hair",
  "Gym & Nutrition",
  "Grooming",
  "Teeth & Smile",
  "Fragrance",
  "Photo journal",
];

export default function CategoryRail() {
  return (
    <section className="category-strip" aria-label="Explore your everyday">
      <div className="category-strip-heading">
        <span className="eyebrow">EXPLORE YOUR EVERYDAY</span>
        <span>Eight categories. Your own direction.</span>
        <span className="category-swipe-hint">
          8 areas · swipe to explore →
        </span>
      </div>
      <nav className="category-rail" aria-label="Browse categories">
        {topics.map((topic, index) => (
          <NavLink key={topic.id} to={`/topics/${topic.id}`}>
            <span className="category-rail-image">
              <img src={asset(topicEditorial(topic.id, topic.image))} alt="" />
            </span>
            <span>{names[index]}</span>
          </NavLink>
        ))}
      </nav>
      <small className="category-strip-credit">
        Editorial references · AI images & licensed stock · illustrations
      </small>
    </section>
  );
}
