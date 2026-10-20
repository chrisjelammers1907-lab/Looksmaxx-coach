import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import {
  X,
  ArrowUpRight,
  Plus,
  ImagePlus,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
let modalCount = 0;
let previousBodyOverflow = "";
let previousRootInert = false;
export function Button({
  children,
  variant = "",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function Field({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input aria-label={label} {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select aria-label={label} {...props}>
        {children}
      </select>
    </label>
  );
}
export function Area({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea aria-label={label} rows={3} {...props} />
    </label>
  );
}
export function Notice({
  children,
  icon = "info",
}: {
  children: ReactNode;
  icon?: string;
}) {
  return (
    <div className={`notice ${icon}`}>
      {icon === "private" ? <LockKeyhole size={16} /> : <Sparkles size={16} />}
      <span>{children}</span>
    </div>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty-mark">C</span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function SectionTitle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function TopicLinks({ topic }: { topic: string }) {
  return (
    <div className="topic-links">
      <Link to={`/coach?topic=${topic}`}>
        <Sparkles size={16} /> Ask your coach <ArrowUpRight size={16} />
      </Link>
      <Link to={`/explore?topic=${topic}`}>
        Explore the community <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = panel.current;
    const controls = () =>
      node?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input, select, textarea, a[href], [tabindex="0"]',
      );
    controls()?.[0]?.focus();
    const handler = (event: KeyboardEvent) => {
      const dialogs = document.querySelectorAll('[aria-modal="true"]');
      if (dialogs[dialogs.length - 1] !== node) return;
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const list = controls();
        if (!list?.length) return;
        const first = list[0],
          last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const root = document.getElementById("root");
    if (modalCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousRootInert = root?.inert ?? false;
    }
    modalCount += 1;
    if (root) root.inert = true;
    document.body.style.overflow = "hidden";
    return () => {
      modalCount -= 1;
      if (modalCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        if (root) root.inert = previousRootInert;
      }
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, []);
  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      className="tabs"
      role="tablist"
      onKeyDown={(event) => {
        const current = tabs.findIndex((tab) => tab.id === value);
        const next =
          event.key === "ArrowRight"
            ? (current + 1) % tabs.length
            : event.key === "ArrowLeft"
              ? (current - 1 + tabs.length) % tabs.length
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? tabs.length - 1
                  : -1;
        if (next < 0) return;
        event.preventDefault();
        onChange(tabs[next].id);
        (
          event.currentTarget.querySelectorAll("button")[
            next
          ] as HTMLButtonElement
        )?.focus();
      }}
    >
      {tabs.map((t) => (
        <button
          role="tab"
          aria-selected={value === t.id}
          key={t.id}
          className={value === t.id ? "active" : ""}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
export function ImageInput({
  label = "Choose a private photo",
  onImage,
}: {
  label?: string;
  onImage: (data: string) => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <label className="upload">
        <ImagePlus size={22} />
        <span>{loading ? "Reading photo…" : label}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={label}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setError("");
            if (
              !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
              file.size > 8 * 1024 * 1024
            ) {
              setError("Choose a JPG, PNG or WebP image under 8 MB.");
              return;
            }
            setLoading(true);
            const reader = new FileReader();
            reader.onload = () => {
              const data = String(reader.result);
              const image = new Image();
              image.onload = () => {
                onImage(data);
                setLoading(false);
              };
              image.onerror = () => {
                setError(
                  "This file could not be decoded as an image. Choose another photo.",
                );
                setLoading(false);
              };
              image.src = data;
            };
            reader.onerror = () => {
              setError("The photo could not be read. Please try another file.");
              setLoading(false);
            };
            reader.readAsDataURL(file);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  );
}
export function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Plus size={16} />
      {children}
    </Button>
  );
}
