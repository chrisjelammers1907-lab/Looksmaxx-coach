import { useState } from "react";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useDemo } from "../lib/store";
import type { Item, TopicId } from "../lib/types";
import { uid, today, money, asset, safePurchaseUrl } from "../lib/domain";
import {
  Area,
  Button,
  Empty,
  Field,
  ImageInput,
  Modal,
  Notice,
  Select,
  SectionTitle,
} from "./ui";
export function ItemBreakdown({ items }: { items: Item[] }) {
  return (
    <div className="item-breakdown">
      {items.map((i) => (
        <div className="breakdown-row" key={i.id}>
          <img
            src={
              i.image.startsWith("data:") ? i.image : asset(i.image || "shirt")
            }
            alt=""
          />
          <div>
            <strong>{i.name}</strong>
            <small>
              {i.brand || "Brand not provided"} ·{" "}
              {i.store || "Store not provided"}
            </small>
            <small>
              {i.size} {i.notes && `· ${i.notes}`}
            </small>
            <small>
              {i.checkedAt
                ? `Example price checked ${i.checkedAt}`
                : "Price date unknown"}
            </small>
            {safePurchaseUrl(i.url) ? (
              <a
                href={safePurchaseUrl(i.url)!}
                target="_blank"
                rel="noreferrer"
              >
                User-provided purchase link <ExternalLink size={12} />
              </a>
            ) : (
              <span className="muted small-text">
                Shopping demo · Purchase link unavailable
              </span>
            )}
          </div>
          <span>
            {i.price === null ? "Price unknown" : money(i.price, i.currency)}
          </span>
        </div>
      ))}
    </div>
  );
}
export default function Items({
  topic,
  title = "On your shelf",
  shortlist = false,
}: {
  topic: TopicId;
  title?: string;
  shortlist?: boolean;
}) {
  const { state, update, toast } = useDemo();
  const [editing, setEditing] = useState<Item | null>(null);
  const [adding, setAdding] = useState(false);
  const items = state.items.filter((i) => i.topic === topic);
  const blank: Item = {
    id: uid(),
    topic,
    name: "",
    brand: "",
    store: "",
    price: null,
    currency: state.profile.currency,
    checkedAt: today(),
    url: "",
    image:
      topic === "clothing" ? "shirt" : topic === "skincare" ? "skin" : topic,
    size: "",
    notes: "",
    tags: "",
  };
  const move = (id: string, direction: number) =>
    update((s) => {
      const all = [...s.items];
      const current = all.findIndex((i) => i.id === id);
      const sibling = items[items.findIndex((i) => i.id === id) + direction];
      if (!sibling) return s;
      const other = all.findIndex((i) => i.id === sibling.id);
      [all[current], all[other]] = [all[other], all[current]];
      return { ...s, items: all };
    });
  return (
    <>
      <SectionTitle
        title={title}
        subtitle="Your editable private collection. Sample items to get you started."
      >
        <Button
          variant="secondary"
          onClick={() => {
            setEditing(blank);
            setAdding(true);
          }}
        >
          <Plus size={16} />
          Add {topic === "clothing" ? "item" : "product"}
        </Button>
      </SectionTitle>
      {items.length ? (
        <div
          className={topic === "clothing" ? "wardrobe-grid" : "product-grid"}
        >
          {items.map((i, index) => (
            <article className="product-card" key={i.id}>
              <div className="product-image">
                <img
                  src={i.image.startsWith("data:") ? i.image : asset(i.image)}
                  alt={`${i.name} — ${i.image.startsWith("data:") ? "private upload" : "editorial reference"}`}
                  loading="lazy"
                />
                {i.image.startsWith("data:") && (
                  <span className="image-tag">Private photo</span>
                )}
              </div>
              <div className="product-content">
                <small className="eyebrow">
                  {i.brand || "YOUR COLLECTION"}
                </small>
                <h3>{i.name}</h3>
                <p>
                  {i.price === null
                    ? "Price not provided"
                    : money(i.price, i.currency)}
                  <span> · {i.size || "Personal item"}</span>
                </p>
                {i.notes && <p className="small-text">{i.notes}</p>}
                <div className="card-controls">
                  <button
                    className="text-button"
                    onClick={() => {
                      setEditing(i);
                      setAdding(false);
                    }}
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <div>
                    <button
                      className="icon-button compact"
                      disabled={index === 0}
                      aria-label={`Move ${i.name} up`}
                      onClick={() => move(i.id, -1)}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      className="icon-button compact"
                      disabled={index === items.length - 1}
                      aria-label={`Move ${i.name} down`}
                      onClick={() => move(i.id, 1)}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      className="icon-button compact"
                      aria-label={`Delete ${i.name}`}
                      onClick={() => {
                        update((s) => ({
                          ...s,
                          items: s.items.filter((p) => p.id !== i.id),
                          outfits: s.outfits.map((o) => ({
                            ...o,
                            itemIds: o.itemIds.filter((id) => id !== i.id),
                          })),
                        }));
                        toast(
                          "Item removed from your private collection and outfits.",
                        );
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {shortlist && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        shortlist: s.shortlist.includes(i.id)
                          ? s.shortlist.filter((id) => id !== i.id)
                          : [...s.shortlist, i.id],
                      }))
                    }
                  >
                    {state.shortlist.includes(i.id)
                      ? "✓ Shortlisted"
                      : "Add to shortlist"}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="A little room for something new."
          action={
            <Button
              onClick={() => {
                setEditing(blank);
                setAdding(true);
              }}
            >
              Add your first item
            </Button>
          }
        >
          Your collection is private by default.
        </Empty>
      )}
      {editing && (
        <Modal
          title={adding ? "Add to your collection" : "Edit your item"}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.name.trim()) return;
              update((s) => ({
                ...s,
                items: adding
                  ? [...s.items, editing]
                  : s.items.map((i) => (i.id === editing.id ? editing : i)),
              }));
              setEditing(null);
              toast("Private item saved for this session.");
            }}
          >
            <Notice icon="private">
              Session only. Uploaded item photos are excluded from public post
              previews.
            </Notice>
            <Field
              label="Item name"
              required
              maxLength={80}
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <div className="form-grid">
              <Field
                label="Brand"
                value={editing.brand}
                onChange={(e) =>
                  setEditing({ ...editing, brand: e.target.value })
                }
              />
              <Field
                label="Store"
                value={editing.store}
                onChange={(e) =>
                  setEditing({ ...editing, store: e.target.value })
                }
              />
              <Field
                label="Price (leave blank if unknown)"
                type="number"
                min="0"
                step="0.01"
                value={editing.price ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    price:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
              <Select
                label="Currency"
                value={editing.currency}
                onChange={(e) =>
                  setEditing({ ...editing, currency: e.target.value })
                }
              >
                {["EUR", "USD", "GBP"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
              <Field
                label="Price-check date"
                type="date"
                value={editing.checkedAt}
                onChange={(e) =>
                  setEditing({ ...editing, checkedAt: e.target.value })
                }
              />
              <Field
                label="Size / fit (optional)"
                value={editing.size}
                onChange={(e) =>
                  setEditing({ ...editing, size: e.target.value })
                }
              />
            </div>
            <Field
              label="Purchase link (HTTPS, optional)"
              type="url"
              pattern="https://.*"
              value={editing.url}
              onChange={(e) => setEditing({ ...editing, url: e.target.value })}
            />
            <Field
              label="Tags"
              value={editing.tags}
              onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
            />
            <Area
              label="Notes"
              value={editing.notes}
              onChange={(e) =>
                setEditing({ ...editing, notes: e.target.value })
              }
            />
            <ImageInput
              label="Add a private item photo"
              onImage={(data) => setEditing({ ...editing, image: data })}
            />
            {editing.image.startsWith("data:") && (
              <div className="upload-preview">
                <img src={editing.image} alt="Private item preview" />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      image: topic === "clothing" ? "shirt" : "skin",
                    })
                  }
                >
                  Remove photo
                </Button>
              </div>
            )}
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save item</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
