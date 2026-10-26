import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Plus,
  Copy,
  Pencil,
  Trash2,
  Shirt,
  Check,
  Share2,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { asset, money, totalPrice, uid } from "../lib/domain";
import type { Outfit, ClothingStyle } from "../lib/types";
import { clothingStyles } from "../lib/data";
import Items, { ItemBreakdown } from "../components/Items";
import {
  Area,
  Button,
  Empty,
  Field,
  ImageInput,
  Modal,
  Notice,
  PageHeader,
  SectionTitle,
  Select,
  Tabs,
  TopicLinks,
} from "../components/ui";
export default function ClothingPage() {
  const { state, update, toast } = useDemo();
  const [search, setSearch] = useSearchParams();
  const [tab, setTab] = useState(search.get("tab") || "overview");
  const [editing, setEditing] = useState<Outfit | null>(null);
  const [detail, setDetail] = useState<Outfit | null>(null);
  const [filter, setFilter] = useState("");
  const [shopBudget, setShopBudget] = useState(state.profile.budget);
  const [illustration, setIllustration] = useState(false);
  const [illustrationLoading, setIllustrationLoading] = useState(false);
  const [illustrationDone, setIllustrationDone] = useState(false);
  const switcher = useRef<HTMLDivElement>(null);
  // Keep the chosen style visible in the scrolling pill row.
  useEffect(() => {
    const row = switcher.current;
    const pill = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && pill && row.scrollWidth > row.clientWidth)
      row.scrollLeft = pill.offsetLeft - row.offsetLeft - 16;
  }, [state.style]);
  const theme =
    clothingStyles.find((t) => t.id === state.style) ?? clothingStyles[0];
  const items = state.items.filter((i) => i.topic === "clothing");
  const outfits = state.outfits.filter((o) =>
    o.title.toLowerCase().includes(filter.toLowerCase()),
  );
  const newOutfit = (): Outfit => ({
    id: uid(),
    title: "",
    itemIds: [],
    style: state.style,
    occasion: "Everyday",
    season: "All seasons",
    notes: "",
  });
  const setView = (value: string) => {
    setTab(value);
    setSearch({ tab: value });
  };
  return (
    <div
      className={`clothing-page clothing-${state.style}`}
      data-testid="clothing-section"
    >
      <PageHeader
        title="Clothing & style"
        description="A wardrobe with intention. A style that is entirely your own."
        action={
          <Link to="/profile" className="small-text text-link">
            {state.profile.country} · {state.profile.currency} · Budget{" "}
            {state.profile.budget}
            <ArrowUpRight size={14} />
          </Link>
        }
      />
      <TopicLinks topic="clothing" />
      <div
        ref={switcher}
        className="style-switcher"
        role="group"
        aria-label="Clothing style"
      >
        {clothingStyles.map((t) => (
          <button
            key={t.id}
            aria-pressed={state.style === t.id}
            className={state.style === t.id ? "selected" : ""}
            onClick={() => update((s) => ({ ...s, style: t.id }))}
          >
            <span className={`theme-dot dot-${t.id}`} />
            <span>
              <strong>{t.label}</strong>
              <small>{t.desc}</small>
            </span>
            {state.style === t.id && <Check size={16} />}
          </button>
        ))}
      </div>
      <Tabs
        value={tab}
        onChange={setView}
        tabs={[
          { id: "overview", label: "The edit" },
          { id: "wardrobe", label: "My wardrobe" },
          { id: "outfits", label: "My outfits" },
          { id: "inspiration", label: "Inspiration" },
          { id: "shopping", label: "Shopping demo" },
        ]}
      />
      {tab === "overview" && (
        <>
          <section className="clothing-hero">
            <div>
              <h2>{theme.hero}</h2>
              <p>{theme.sub}</p>
              <Button variant="theme" onClick={() => setView("outfits")}>
                Build your everyday edit
                <ArrowUpRight size={18} />
              </Button>
            </div>
            <img src={asset(`photo-style-${state.style}`)} alt="" />
          </section>
          <div className="quick-grid">
            <button onClick={() => setView("wardrobe")}>
              <Shirt />
              <h3>Your wardrobe</h3>
              <p>{items.length} considered pieces</p>
              <ArrowUpRight size={19} />
            </button>
            <button
              onClick={() => {
                setEditing(newOutfit());
              }}
            >
              <Plus />
              <h3>Make an outfit</h3>
              <p>Good things, put together.</p>
              <ArrowUpRight size={19} />
            </button>
            <Link to={`/explore?topic=clothing&style=${state.style}`}>
              <Share2 />
              <h3>A shared point of view</h3>
              <p>Explore fictional community edits.</p>
              <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="editorial-note">
            <Shirt size={25} />
            <div>
              <h3>Start with what you have.</h3>
              <p>
                Fit and color are personal. Your current profile preferences:{" "}
                {state.profile.preferences ||
                  "Add your preferences in your profile."}
              </p>
              <Link to="/coach?topic=clothing">
                Discuss fit, color & budget <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </>
      )}
      {tab === "wardrobe" && (
        <Items topic="clothing" title="Good pieces. Your pieces." />
      )}
      {tab === "outfits" && (
        <>
          <SectionTitle
            title="Your everyday combinations"
            subtitle="Private by default. Share only through an explicit post preview."
          >
            <Button onClick={() => setEditing(newOutfit())}>
              <Plus size={16} />
              Build an outfit
            </Button>
          </SectionTitle>
          <Field
            label="Find an outfit"
            placeholder="Search your saved outfits…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {outfits.length ? (
            <div className="outfit-grid">
              {outfits.map((o) => {
                const selected = state.items.filter((i) =>
                  o.itemIds.includes(i.id),
                );
                return (
                  <article className="outfit-card" key={o.id}>
                    <button
                      className="outfit-collage"
                      aria-label={`Open ${o.title}`}
                      onClick={() => setDetail(o)}
                    >
                      {o.wornPhoto ? (
                        <img
                          src={o.wornPhoto}
                          alt="Private real worn-outfit photo"
                        />
                      ) : (
                        selected
                          .slice(0, 3)
                          .map((i) => (
                            <img
                              key={i.id}
                              src={
                                i.image.startsWith("data:")
                                  ? i.image
                                  : asset(i.image)
                              }
                              alt={i.name}
                            />
                          ))
                      )}
                      {!selected.length && !o.wornPhoto && <Shirt size={60} />}
                      <span className="image-tag">
                        {o.wornPhoto
                          ? "Real worn photo · Private"
                          : "Private outfit · Editorial references"}
                      </span>
                    </button>
                    <div className="product-content">
                      <span className="eyebrow">
                        {o.style.replace("-", " ")} · {o.occasion}
                      </span>
                      <h3>{o.title}</h3>
                      <p>{totalPrice(selected)} · Example prices</p>
                      <div className="card-controls">
                        <button
                          className="text-button"
                          onClick={() => setEditing(o)}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          className="text-button"
                          onClick={() => {
                            update((s) => ({
                              ...s,
                              outfits: [
                                ...s.outfits,
                                { ...o, id: uid(), title: `${o.title} — copy` },
                              ],
                            }));
                            toast("Editable private outfit duplicated.");
                          }}
                        >
                          <Copy size={13} />
                          Duplicate
                        </button>
                        <button
                          className="icon-button compact"
                          aria-label={`Delete ${o.title}`}
                          onClick={() =>
                            update((s) => ({
                              ...s,
                              outfits: s.outfits.filter((x) => x.id !== o.id),
                            }))
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <Link
                        className="text-link share-outfit"
                        to={`/explore?compose=${o.id}`}
                      >
                        Preview & share outfit <Share2 size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Empty
              title="Your next good combination."
              action={
                <Button onClick={() => setEditing(newOutfit())}>
                  Build an outfit
                </Button>
              }
            >
              Try a different search or assemble pieces from your wardrobe.
            </Empty>
          )}
        </>
      )}
      {tab === "inspiration" && (
        <>
          <SectionTitle
            title={`The ${theme.label.toLowerCase()} point of view`}
            subtitle="Looks to save, copy and make your own."
          />
          <div className="inspiration-grid">
            <article className="inspiration-card">
              <img
                src={asset(`photo-style-${state.style}`)}
                alt={`${theme.label} outfit`}
              />
              <div>
                <span className="pill">Worn outfit</span>
                <h3>{theme.hero}</h3>
                <p>
                  Warm layers, individual proportions. Use this as a mood, not a
                  rule.
                </p>
                <Link
                  className="text-link"
                  to={`/explore?topic=clothing&style=${state.style}`}
                >
                  Explore related outfits <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
            <article className="tryon-card">
              <Shirt size={80} />
              <h3>Imagine the combination.</h3>
              <p>
                A separate AI try-on placeholder. It never counts as a real worn
                outfit or progress photo.
              </p>
              <Button
                onClick={() => {
                  setIllustration(true);
                  setIllustrationDone(false);
                }}
              >
                Open simulated try-on
              </Button>
            </article>
          </div>
        </>
      )}
      {tab === "shopping" && (
        <>
          <Notice>
            Prices shown in {state.profile.currency} for {state.profile.country}
            . Example prices — live shops come later.
          </Notice>
          <SectionTitle
            title={`Considered finds · ${theme.label}`}
            subtitle="Filter the example catalog by your budget."
          />
          <Field
            label={`Maximum example price (${state.profile.currency})`}
            type="number"
            min="0"
            value={shopBudget}
            onChange={(e) => setShopBudget(Number(e.target.value))}
          />
          <ItemBreakdown
            items={items.filter(
              (i) =>
                i.currency === state.profile.currency &&
                (i.price === null || i.price <= shopBudget),
            )}
          />
          {!items.some(
            (i) =>
              i.currency === state.profile.currency &&
              (i.price === null || i.price <= shopBudget),
          ) && (
            <Empty title="No example finds in this range.">
              Try a larger budget or update your collection.
            </Empty>
          )}
          <p className="small-text">
            Items in other currencies are excluded. Unknown prices remain
            visibly unknown.
          </p>
        </>
      )}

      {editing && (
        <Modal
          title={
            state.outfits.some((o) => o.id === editing.id)
              ? "Edit your outfit"
              : "Build an outfit"
          }
          onClose={() => setEditing(null)}
          wide
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.itemIds.length) return;
              update((s) => ({
                ...s,
                outfits: s.outfits.some((o) => o.id === editing.id)
                  ? s.outfits.map((o) => (o.id === editing.id ? editing : o))
                  : [...s.outfits, editing],
              }));
              setEditing(null);
              toast("Outfit saved privately for this session.");
              setView("outfits");
            }}
          >
            <Field
              label="Outfit name"
              required
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
            <div className="form-grid">
              <Select
                label="Outfit style"
                value={editing.style}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    style: e.target.value as ClothingStyle,
                  })
                }
              >
                {clothingStyles.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Occasion"
                value={editing.occasion}
                onChange={(e) =>
                  setEditing({ ...editing, occasion: e.target.value })
                }
              >
                {["Everyday", "Weekend", "Work", "Evening", "Travel"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </Select>
              <Select
                label="Season"
                value={editing.season}
                onChange={(e) =>
                  setEditing({ ...editing, season: e.target.value })
                }
              >
                {["All seasons", "Spring", "Summer", "Autumn", "Winter"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </Select>
            </div>
            <SectionTitle
              title="Choose your pieces"
              subtitle="Select one or more wardrobe items."
            />
            <div className="item-picker">
              {items.map((i) => (
                <label
                  key={i.id}
                  className={editing.itemIds.includes(i.id) ? "selected" : ""}
                >
                  <input
                    type="checkbox"
                    aria-label={`${i.name}${i.brand ? `, ${i.brand}` : ""}`}
                    checked={editing.itemIds.includes(i.id)}
                    onChange={() =>
                      setEditing({
                        ...editing,
                        itemIds: editing.itemIds.includes(i.id)
                          ? editing.itemIds.filter((id) => id !== i.id)
                          : [...editing.itemIds, i.id],
                      })
                    }
                  />
                  <img
                    src={i.image.startsWith("data:") ? i.image : asset(i.image)}
                    alt=""
                  />
                  <span className="piece-text">
                    <small>{i.brand || "No brand added"}</small>
                    <strong>{i.name}</strong>
                    {i.price !== null && (
                      <small>{money(i.price, i.currency)}</small>
                    )}
                  </span>
                </label>
              ))}
            </div>
            {!items.length && <Notice>Add items in My wardrobe first.</Notice>}
            <p className="outfit-total">
              {totalPrice(items.filter((i) => editing.itemIds.includes(i.id)))}
            </p>
            <Area
              label="Fit, color & styling notes"
              value={editing.notes}
              onChange={(e) =>
                setEditing({ ...editing, notes: e.target.value })
              }
            />
            <ImageInput
              label="Add a private real worn-outfit photo"
              onImage={(wornPhoto) => setEditing({ ...editing, wornPhoto })}
            />
            {editing.wornPhoto && (
              <div className="upload-preview">
                <img
                  src={editing.wornPhoto}
                  alt="Real worn-outfit private preview"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setEditing({ ...editing, wornPhoto: undefined })
                  }
                >
                  Remove worn photo
                </Button>
              </div>
            )}
            <p className="small-text">
              Only upload your own real worn-outfit photo here. It stays in this
              session and is excluded from community post previews.
            </p>
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!editing.itemIds.length}>
                Save outfit
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)} wide>
          <p>{detail.notes}</p>
          <div className="pill">
            {detail.style} · {detail.occasion} · {detail.season}
          </div>
          <ItemBreakdown
            items={state.items.filter((i) => detail.itemIds.includes(i.id))}
          />
          <p className="outfit-total">
            {totalPrice(
              state.items.filter((i) => detail.itemIds.includes(i.id)),
            )}
          </p>
          <Link className="button" to={`/explore?compose=${detail.id}`}>
            Preview & share <Share2 size={15} />
          </Link>
        </Modal>
      )}
      {illustration && (
        <Modal
          title="Simulated outfit visualization"
          onClose={() => setIllustration(false)}
        >
          <Notice>
            A sketch of the outfit, not a try-on. Fit and colour can look
            different on you.
          </Notice>
          {illustrationDone ? (
            <div className="outfit-illustration">
              <Shirt size={140} strokeWidth={0.6} />
              <div className="illustration-trousers" />
              <span>ILLUSTRATION PLACEHOLDER</span>
              <p>{theme.label} · Shape and color study</p>
            </div>
          ) : (
            <div className="empty">
              <Shirt size={70} />
              <p>See a labelled diagram of a possible combination.</p>
            </div>
          )}
          <Button
            disabled={illustrationLoading}
            onClick={() => {
              setIllustrationLoading(true);
              setTimeout(() => {
                setIllustrationLoading(false);
                setIllustrationDone(true);
              }, 600);
            }}
          >
            {illustrationLoading
              ? "Loading example…"
              : "Show simulated illustration"}
          </Button>
        </Modal>
      )}
    </div>
  );
}
