import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ArrowUpRight } from "lucide-react";
import { guides } from "../lib/guides";
import { topics } from "../lib/data";
import { asset } from "../lib/domain";
import { Empty } from "../components/ui";
import { isAIEditorial, topicEditorial } from "../lib/editorial";
export default function GuidePage() {
  const { topic } = useParams();
  const entry = topics.find((t) => t.id === topic);
  if (!entry)
    return (
      <Empty title="Guide not found">
        <Link to="/categories">Browse categories</Link>
      </Empty>
    );
  const guide = guides[entry.id];
  return (
    <article className="guide-page">
      <Link className="text-link" to={`/topics/${entry.id}`}>
        <ArrowLeft size={16} /> Back to {entry.title}
      </Link>
      <header className="guide-hero">
        <div>
          <span className="eyebrow">
            <BookOpen size={14} /> THE BEGINNER’S GUIDE / {entry.number}
          </span>
          <h1>{guide.title}</h1>
          <p>{guide.intro}</p>
          <span className="guide-meta">
            CHARETT editorial · {guide.steps.length} practical chapters
          </span>
        </div>
        <img
          src={asset(topicEditorial(entry.id, entry.image))}
          alt={`${entry.title} editorial illustration`}
        />
        {isAIEditorial(topicEditorial(entry.id, entry.image)) && (
          <span className="hero-image-credit">AI editorial inspiration</span>
        )}
      </header>
      <div className="guide-layout">
        <nav aria-label="Guide chapters" className="guide-contents">
          <span className="eyebrow">IN THIS GUIDE</span>
          {guide.steps.map((step, i) => (
            <button
              type="button"
              key={step.title}
              onClick={() =>
                document
                  .getElementById(`chapter-${i}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {step.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("guide-sources")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            References & further reading
          </button>
        </nav>
        <div className="guide-article">
          {guide.steps.map((step, i) => (
            <section id={`chapter-${i}`} key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </section>
          ))}
          <aside className="guide-remember">
            <BookOpen size={22} />
            <p>{guide.remember}</p>
          </aside>
          <section id="guide-sources" className="guide-sources">
            <span className="eyebrow">READ WITH CONTEXT</span>
            <h2>Where this guide comes from</h2>
            <p>
              Original editorial summaries informed by the supplied references.
              Those documents contain personal opinions and unverified claims;
              they are not clinical evidence or instructions to follow.
            </p>
            {guide.references.map((ref) => (
              <details key={ref.name}>
                <summary>{ref.name}</summary>
                <p>{ref.note}</p>
              </details>
            ))}
            {guide.reading.length > 0 && (
              <>
                <h3>Official resources for further reading</h3>
                <p className="small-text">
                  Use these official resources for further reading. This guide
                  is general education, not an individual treatment assessment.
                </p>
                {guide.reading.map((link) => (
                  <a
                    className="reading-link"
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
