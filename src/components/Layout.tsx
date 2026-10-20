import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Grid2X2,
  MessageCircle,
  ListChecks,
  UserRound,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useDemo } from "../lib/store";
const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: Grid2X2 },
  { to: "/coach", label: "AI Coach", icon: Sparkles },
  { to: "/plan", label: "My Plan", icon: ListChecks },
  { to: "/messages", label: "Messages", icon: MessageCircle },
];
export default function Layout() {
  const { state } = useDemo();
  const location = useLocation();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (menu.current) menu.current.open = false;
    document.title = `CHARETT — ${location.pathname === "/" ? "For You" : location.pathname.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ")}`;
  }, [location.pathname, location.search]);
  const active = (to: string) =>
    to === "/categories" && location.pathname.startsWith("/topics/");
  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="sidebar">
        <Link className="wordmark" to="/">
          CHARETT<span>THE ART OF BECOMING</span>
        </Link>
        <div className="nav-label">YOUR EVERYDAY EDIT</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                isActive || active(to) ? "active" : ""
              }
            >
              <Icon size={19} />
              {label}
              {label === "Messages" && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-story">
          <span className="eyebrow">STYLE · SELF-CARE · PROGRESS</span>
          <p>
            Small steps.
            <br />
            <em>Your own direction.</em>
          </p>
          <BookOpen size={19} />
          <span>
            Beginner guides live
            <br />
            inside every category.
          </span>
        </div>
        <Link className="sidebar-about" to="/about">
          About us <ArrowUpRight size={15} />
        </Link>
        <Link to="/profile" className="sidebar-user">
          <span className="avatar">{state.profile.name.slice(0, 1)}</span>
          <span>
            {state.profile.name}
            <small>
              {state.profile.visibility === "private"
                ? "Private account"
                : "Public account"}{" "}
              · demo
            </small>
          </span>
          <LockKeyhole size={14} />
        </Link>
      </aside>
      <div className="app-content">
        <header className="topbar">
          <Link className="mobile-brand" to="/">
            CHARETT
          </Link>
          <span className="topbar-note">
            Style. Self-care. Your own direction.
          </span>
          <div className="topbar-right">
            <Link className="topbar-about" to="/about">
              About us
            </Link>
            <span className="demo-pill">
              <i /> INTERACTIVE DEMO
            </span>
            <details className="profile-menu" ref={menu}>
              <summary aria-label="Open profile and menu">
                <span className="avatar small">
                  {state.profile.name.slice(0, 1)}
                </span>
              </summary>
              <nav aria-label="Profile menu">
                <Link to="/profile">
                  <UserRound size={16} /> My profile
                </Link>
                <Link to="/profile?saved=true">
                  <BookOpen size={16} /> Private saves
                </Link>
                <Link to="/about">
                  About us <ArrowUpRight size={15} />
                </Link>
              </nav>
            </details>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="footer">
          <span>
            CHARETT <i>·</i> Your everyday, elevated.
          </span>
          <Link to="/about">About us & demo privacy</Link>
          <span>Fictional activity · Private uploads stay in this tab</span>
        </footer>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              isActive || active(to) ? "active" : ""
            }
          >
            <Icon size={21} />
            <span>{label === "My Plan" ? "My Plan" : label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
