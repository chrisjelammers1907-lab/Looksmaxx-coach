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
  Settings,
} from "lucide-react";
import { useEffect, useRef, Suspense } from "react";
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
      <div className="site-shell">
        <header className="site-header">
          <div className="brand-bar">
            <span className="brand-note" aria-hidden="true" />
            <Link className="wordmark" to="/" aria-label="CHARETT home">
              CHARETT<span>The art of becoming</span>
            </Link>
            <div className="topbar-right">
              <Link className="topbar-about" to="/about">
                About us
              </Link>
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
                  <Link to="/settings">
                    <Settings size={16} /> Settings
                  </Link>
                  <Link to="/about">
                    About us <ArrowUpRight size={15} />
                  </Link>
                </nav>
              </details>
            </div>
          </div>
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
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <div className="app-content">
          <main id="main" tabIndex={-1}>
            {/* Pages load on first visit; the frame stays put meanwhile. */}
            <Suspense
              fallback={<div className="page-loading" aria-busy="true" />}
            >
              <Outlet />
            </Suspense>
          </main>
          <footer className="footer">
            <span className="footer-mark">CHARETT</span>
            <Link to="/about">About us & privacy</Link>
          </footer>
        </div>
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
            <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
