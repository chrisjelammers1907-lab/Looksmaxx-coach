import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useDemo } from "../lib/store";
import { asset } from "../lib/domain";
import type { Ad } from "../lib/ads";
import { DEMO } from "../lib/demo";

/** A sponsored post in the Free feed. The sponsors are fictional. */
export function SponsoredPost({ ad }: { ad: Ad }) {
  const { toast } = useDemo();
  return (
    <article
      className="post-card photo-card sponsored-card"
      aria-label={`Sponsored by ${ad.brand}`}
    >
      <div className="post-author">
        <span className="author-link">
          <span className="avatar">{ad.initials}</span>
          <span>
            <strong>{ad.brand}</strong>
            <small>Sponsored</small>
          </span>
        </span>
      </div>
      <div className="post-media sponsored-media">
        <img loading="lazy" decoding="async" src={asset(ad.image)} alt="" />
      </div>
      <button
        type="button"
        className="sponsored-cta"
        onClick={() =>
          toast(
            DEMO
              ? "Sponsored posts are simulated in this demo."
              : `Opening ${ad.brand}…`,
          )
        }
      >
        {ad.cta}
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <div className="post-body">
        <div className="post-caption">
          <p>
            <strong>{ad.headline}</strong> {ad.text}
          </p>
        </div>
        <Link className="sponsored-remove" to="/plans">
          Remove ads with Plus
        </Link>
      </div>
    </article>
  );
}
