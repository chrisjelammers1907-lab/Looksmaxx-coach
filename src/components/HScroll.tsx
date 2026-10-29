import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * A horizontal row that scrolls with touch, trackpad, mouse wheel and mouse
 * drag, with arrow buttons and edge fades whenever there is more to see.
 */
export default function HScroll({
  children,
  className = "",
  label,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; label?: string }) {
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const measure = () => {
    const node = row.current;
    if (!node) return;
    setEdges({
      start: node.scrollLeft > 4,
      end: node.scrollLeft + node.clientWidth < node.scrollWidth - 4,
    });
  };
  useEffect(() => {
    const node = row.current;
    if (!node) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    // A vertical wheel scrolls the row sideways while it can still move.
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = node.scrollWidth - node.clientWidth;
      if (max <= 0) return;
      const next = node.scrollLeft + event.deltaY;
      if (
        (next <= 0 && node.scrollLeft <= 0) ||
        (next >= max && node.scrollLeft >= max)
      )
        return;
      event.preventDefault();
      node.scrollLeft = Math.max(0, Math.min(max, next));
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => {
      observer.disconnect();
      node.removeEventListener("wheel", wheel);
    };
  }, []);
  const page = (direction: number) =>
    row.current?.scrollBy({
      left: direction * row.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  return (
    <div
      className={`hscroll ${edges.start ? "has-start" : ""} ${edges.end ? "has-end" : ""}`}
    >
      <div
        ref={row}
        className={`hscroll-row ${className}`}
        aria-label={label}
        onScroll={measure}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || !row.current) return;
          drag.current = {
            x: event.clientX,
            left: row.current.scrollLeft,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current || !row.current) return;
          const dx = event.clientX - drag.current.x;
          if (Math.abs(dx) > 5) drag.current.moved = true;
          if (drag.current.moved)
            row.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => {
          const moved = drag.current?.moved;
          drag.current = null;
          // Swallow the click that ends a drag so it doesn't open an item.
          if (moved)
            row.current?.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                e.stopPropagation();
              },
              { capture: true, once: true },
            );
        }}
        onPointerLeave={() => (drag.current = null)}
        {...rest}
      >
        {children}
      </div>
      <button
        type="button"
        className="hscroll-arrow prev"
        aria-label="Scroll left"
        tabIndex={-1}
        onClick={() => page(-1)}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className="hscroll-arrow next"
        aria-label="Scroll right"
        tabIndex={-1}
        onClick={() => page(1)}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
