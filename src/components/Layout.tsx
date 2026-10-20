import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  MessageCircle,
  ListChecks,
  UserRound,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";
import { useEffect } from "react";
import { topics } from "../lib/data";
import { useDemo } from "../lib/store";
const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/plan", label: "My plan", icon: ListChecks },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "My profile", icon: UserRound },
];
export default function Layout() {
  const { state } = useDemo();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `CHARETT — ${location.pathname === "/" ? "Your everyday, elevated." : location.pathname.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ")}`;
  }, [location.pathname]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link className="wordmark" to="/">
          CHARETT<span>THE ART OF BECOMING</span>
        </Link>
        <div className="nav-label">YOUR SPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"}>
              <Icon size={19} />
              {label}
              {label === "Messages" && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="nav-label topic-nav-label">THE EDIT</div>
        <nav className="topic-nav" aria-label="Topic navigation">
          {topics.map((t) => (
            <NavLink key={t.id} to={`/topics/${t.id}`}>
              {t.title}
              <ChevronRight size={13} />
            </NavLink>
          ))}
        </nav>
        <Link className="sidebar-coach" to="/coach">
          <Sparkles size={20} />
          <strong>
            A little guidance,
            <br />a lot of possibility.
          </strong>
          <span>
            Meet your coach <ArrowUpRight size={15} />
          </span>
          <small>SIMULATED AI DEMO</small>
        </Link>
        <Link to="/profile" className="sidebar-user">
          <span className="avatar">{state.profile.name.slice(0, 1)}</span>
          <span>
            {state.profile.name}
            <small>Private test profile</small>
          </span>
          <LockKeyhole size={14} />
        </Link>
      </aside>
      <div className="app-content">
        <div className="topbar">
          <Link className="mobile-brand" to="/">
            CHARETT
          </Link>
          <span className="topbar-note">A considered approach to you.</span>
          <div className="topbar-right">
            <span className="demo-pill">
              <i /> INTERACTIVE DEMO
            </span>
            <Link
              to="/profile"
              aria-label="Open private profile"
              className="avatar small"
            >
              {state.profile.name.slice(0, 1)}
            </Link>
          </div>
        </div>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="footer">
          <span>
            CHARETT <i>·</i> Your everyday, elevated.
          </span>
          <span>
            Fictional demo · Local activity · Private uploads stay in this
            session
          </span>
        </footer>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon size={21} />
            <span>
              {label
                .replace("My plan", "Plan")
                .replace("My profile", "Profile")}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
