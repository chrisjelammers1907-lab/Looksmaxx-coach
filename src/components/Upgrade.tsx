import { Link } from "react-router-dom";
import Monogram from "./Monogram";

/** A quiet prompt where a Free limit is reached. */
export function UpgradeCard({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="upgrade-card" role="note">
      <Monogram size={32} />
      <div>
        <strong>{title}</strong>
        {children && <p>{children}</p>}
      </div>
      <Link className="button small" to="/plans">
        See plans
      </Link>
    </div>
  );
}

export const PlusTag = ({ plan = "Plus" }: { plan?: string }) => (
  <span className="plus-tag">{plan}</span>
);
