import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Check, X } from "lucide-react";
import { extraGuides, guides } from "../lib/guides";
import { topics } from "../lib/data";
import { asset } from "../lib/domain";
import { Empty } from "../components/ui";
import { topicPhoto } from "../lib/editorial";
import Monogram from "../components/Monogram";
export default function GuidePage() {
  const { topic, slug } = useParams();
  const entry = topics.find((t) => t.id === topic);
  const extra = slug ? extraGuides[slug] : undefined;
  if (!entry || (slug && extra?.topic !== entry.id))
    return (
      <Empty title="Guide not found">
        <Link to="/categories">Browse categories</Link>
      </Empty>
    );
  const guide = extra || guides[entry.id];
  const related = [
    ...(slug
      ? [{ to: `/topics/${entry.id}/guide`, label: guides[entry.id].title }]
      : []),
    ...Object.entries(extraGuides)
      .filter(([key, g]) => g.topic === entry.id && key !== slug)
      .map(([key, g]) => ({
        to: `/topics/${entry.id}/guide/${key}`,
        label: g.title,
      })),
  ];
  const chapters = [
    { id: "guide-products", label: guide.productsTitle },
    { id: "guide-routine", label: "Put it together" },
    { id: "guide-works", label: "What works and what doesn’t" },
    { id: "guide-coach", label: "Make it yours" },
  ];
  return (
    <article className="guide-page">
      <Link className="text-link" to={`/topics/${entry.id}`}>
        <ArrowLeft size={16} /> Back to {entry.title}
      </Link>
      <header className="guide-hero">
        <div>
          <h1>{guide.title}</h1>
          <p>{guide.intro}</p>
          <span className="guide-meta">
            {guide.products.length} essentials · {guide.routine.length} steps
          </span>
        </div>
        <img src={asset(topicPhoto(entry.id))} alt="" />
      </header>
      <div className="guide-layout">
        <nav aria-label="Guide chapters" className="guide-contents">
          <span className="eyebrow">IN THIS GUIDE</span>
          {chapters.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() =>
                document
                  .getElementById(c.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {c.label}
            </button>
          ))}
        </nav>
        <div className="guide-article">
          <section id="guide-products">
            <h2>{guide.productsTitle}</h2>
            <dl className="guide-products">
              {guide.products.map((p) => (
                <div key={p.name}>
                  <dt>{p.name}</dt>
                  <dd>{p.does}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section id="guide-routine">
            <h2>Put it together</h2>
            <ol className="guide-steps">
              {guide.routine.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
          <section id="guide-works" className="guide-verdict">
            <h2>What works and what doesn’t</h2>
            <div>
              <div className="verdict works">
                <h3>Works</h3>
                <ul>
                  {guide.works.map((w) => (
                    <li key={w}>
                      <Check size={16} aria-hidden="true" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="verdict skip">
                <h3>Doesn’t</h3>
                <ul>
                  {guide.skip.map((w) => (
                    <li key={w}>
                      <X size={16} aria-hidden="true" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          {guide.remember && (
            <aside className="guide-remember">
              <BookOpen size={22} />
              <p>{guide.remember}</p>
            </aside>
          )}
          <section id="guide-coach" className="guide-coach">
            <Monogram size={44} />
            <div>
              <h2>Make it yours</h2>
              <p>
                Tell the coach what you use now and what you want to change. It
                turns this guide into a plan for you.
              </p>
            </div>
            <Link className="button" to={`/coach?topic=${entry.id}`}>
              Ask your coach <ArrowRight size={16} />
            </Link>
          </section>
          {related.length > 0 && (
            <nav aria-label="More guides" className="guide-related">
              {related.map((r) => (
                <Link key={r.to} to={r.to}>
                  <BookOpen size={16} /> {r.label}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
