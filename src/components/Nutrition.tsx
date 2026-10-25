import { useState } from "react";
import {
  Calculator,
  ChevronDown,
  Pencil,
  Plus,
  ScanBarcode,
  Scale,
  Target,
  Trash2,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { dateLabel, today, uid } from "../lib/domain";
import {
  activityLevels,
  calorieFloor,
  estimateCalories,
  extraNutrients,
  lookUpBarcode,
  macroFields,
  scaleTo,
  totals,
  weekAverage,
  type Activity,
  type CalorieGoal,
  type CalorieInput,
  type ExtraNutrient,
  type ScannedProduct,
} from "../lib/nutrition";
import { addDays } from "../lib/training";
import {
  cmFromFeet,
  feetFromCm,
  fromKg,
  toKg,
  weightLabel,
} from "../lib/units";
import type { ExtraNutrients, Food, NutritionTargets } from "../lib/types";
import { Link } from "react-router-dom";
import { coachLeft, coachUsage, limitsOf } from "../lib/plans";
import { PlusTag, UpgradeCard } from "./Upgrade";
import BarcodeScanner from "./BarcodeScanner";
import { Button, Empty, Field, Modal, Notice, Select } from "./ui";

const groups = ["Details", "Minerals", "Vitamins"] as const;
const numberOrUndefined = (value: string) =>
  value === "" ? undefined : Math.max(0, Number(value));

/** Optional nutrient inputs, grouped and folded away. */
function ExtraFields({
  values,
  onChange,
  summary,
}: {
  values: ExtraNutrients;
  onChange: (values: ExtraNutrients) => void;
  summary: string;
}) {
  const filled = Object.values(values).filter((v) => v !== undefined).length;
  return (
    <details className="nutrient-extra">
      <summary>
        {summary}
        {filled > 0 && <span> · {filled} filled</span>}
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      {groups.map((group) => (
        <fieldset key={group}>
          <legend>{group === "Details" ? "Carbs & fats" : group}</legend>
          <div className="nutrient-grid">
            {extraNutrients
              .filter((n) => n.group === group)
              .map((n) => (
                <Field
                  key={n.key}
                  label={`${n.label} (${n.unit})`}
                  type="number"
                  min="0"
                  step="any"
                  value={values[n.key] ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [n.key]: numberOrUndefined(e.target.value),
                    })
                  }
                />
              ))}
          </div>
        </fieldset>
      ))}
    </details>
  );
}

function MacroBar({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target?: number;
  unit: string;
}) {
  const share = target ? Math.min(1, value / target) : 0;
  return (
    <div className={`macro-bar ${target && value > target ? "over" : ""}`}>
      <div>
        <span>{label}</span>
        <strong>
          {value}
          <small>
            {target ? ` / ${target}` : ""} {unit}
          </small>
        </strong>
      </div>
      <span className="macro-track" aria-hidden="true">
        <span style={{ width: `${share * 100}%` }} />
      </span>
    </div>
  );
}

function WeightChart({
  entries,
  unit,
}: {
  entries: { date: string; kg: number }[];
  unit: "kg" | "lb";
}) {
  const points = entries.slice(-30);
  if (points.length < 2) return null;
  const values = points.map((p) => fromKg(p.kg, unit));
  const min = Math.min(...values) - 0.5,
    max = Math.max(...values) + 0.5;
  const x = (i: number) => (i / (points.length - 1)) * 300;
  const y = (v: number) => 90 - ((v - min) / (max - min)) * 80;
  const line = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const average = points.map((p) => {
    const avg = weekAverage(points, p.date);
    return avg === undefined ? 0 : fromKg(avg, unit);
  });
  return (
    <svg
      className="weight-chart"
      viewBox="0 0 300 100"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Weight from ${dateLabel(points[0].date)} to ${dateLabel(points.at(-1)!.date)}: ${values[0]} to ${values.at(-1)} ${unit}`}
    >
      <polyline
        className="weight-average"
        points={average.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
      />
      <polyline className="weight-line" points={line} />
      {values.map((v, i) => (
        // A zero-length round-capped line stays a circle when the chart stretches.
        <line key={i} x1={x(i)} y1={y(v)} x2={x(i)} y2={y(v)} />
      ))}
    </svg>
  );
}

export default function Nutrition() {
  const { state, update, toast } = useDemo();
  const unit = state.settings.weightUnit;
  const heightUnit = state.settings.heightUnit;
  const [date, setDate] = useState(today());
  const [food, setFood] = useState<Food | null>(null);
  const [scanning, setScanning] = useState(false);
  const [looking, setLooking] = useState(false);
  const [scanError, setScanError] = useState("");
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [calculating, setCalculating] = useState(false);
  const latest = [...state.weights].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const lastKg = latest.at(-1)?.kg;
  const [calc, setCalc] = useState<CalorieInput>({
    sex: "female",
    age: 25,
    heightCm: 170,
    weightKg: lastKg ?? 70,
    activity: "light",
    goal: "maintain",
  });
  const [weightValue, setWeightValue] = useState("");
  const [weightDate, setWeightDate] = useState(today());
  const meals = state.food.filter((f) => f.date === date);
  const sum = totals(meals);
  const goal = state.nutritionTargets;
  const shownExtras = extraNutrients.filter(
    (n) => sum.extra[n.key] !== undefined || goal?.extra?.[n.key] !== undefined,
  );
  const emptyFood = (extra: Partial<Food> = {}): Food => ({
    id: uid(),
    date,
    name: "",
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    source: "manual",
    ...extra,
  });
  const fromScan = (p: ScannedProduct): Food => {
    const scaled = scaleTo(p.per100, p.grams);
    return emptyFood({
      name: p.name,
      brand: p.brand,
      barcode: p.barcode,
      grams: p.grams,
      source: "scan",
      per100: p.per100,
      ...scaled,
    });
  };
  const scansLeft = coachLeft(state, today()).scans;
  const lookUp = async (code: string) => {
    if (scansLeft <= 0) return;
    setLooking(true);
    setScanError("");
    try {
      const product = await lookUpBarcode(code);
      update((s) => {
        const used = coachUsage(s, today());
        return { ...s, coachUsage: { ...used, scans: used.scans + 1 } };
      });
      setScanning(false);
      if (product) setFood(fromScan(product));
      else {
        toast("We couldn’t find that product. Enter it yourself.");
        setFood(emptyFood({ barcode: code }));
      }
    } catch {
      setScanError(
        "The food database can’t be reached right now. Try again or add the food yourself.",
      );
    } finally {
      setLooking(false);
    }
  };
  const estimate = estimateCalories(calc);
  const avg = lastKg !== undefined ? weekAverage(latest, today()) : undefined;
  const weekBefore = latest.length
    ? weekAverage(latest, addDays(today(), -7))
    : undefined;
  const extraLabel = (n: ExtraNutrient, value?: number) =>
    value === undefined ? "–" : `${value} ${n.unit}`;
  const height = feetFromCm(calc.heightCm);
  return (
    <div className="nutrition">
      <section className="nutrition-day" aria-labelledby="nutrition-title">
        <header className="nutrition-head">
          <div>
            <h2 id="nutrition-title">Food log</h2>
            <p>{date === today() ? "Today" : dateLabel(date)}</p>
          </div>
          <Field
            label="Food log date"
            type="date"
            max={today()}
            value={date}
            onChange={(e) => setDate(e.target.value || today())}
          />
        </header>
        {goal ? (
          <div className="nutrition-summary">
            <div className="kcal-ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" className="track" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="value"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    52 *
                    (1 - Math.min(1, sum.calories / goal.calories))
                  }
                />
              </svg>
              <div>
                <strong>{Math.max(0, goal.calories - sum.calories)}</strong>
                <span>
                  {sum.calories > goal.calories
                    ? `${sum.calories - goal.calories} kcal over`
                    : "kcal left"}
                </span>
              </div>
            </div>
            <div className="macro-bars">
              <MacroBar
                label="Calories"
                value={sum.calories}
                target={goal.calories}
                unit="kcal"
              />
              <MacroBar
                label="Carbs"
                value={sum.carbs}
                target={goal.carbs}
                unit="g"
              />
              <MacroBar
                label="Protein"
                value={sum.protein}
                target={goal.protein}
                unit="g"
              />
              <MacroBar
                label="Fat"
                value={sum.fat}
                target={goal.fat}
                unit="g"
              />
            </div>
          </div>
        ) : (
          <div className="nutrition-setup">
            <Target size={22} aria-hidden="true" />
            <div>
              <strong>Set your daily targets</strong>
              <p>
                Choose your own calories, carbs, protein and fat — or work out
                calories with the calculator first.
              </p>
            </div>
          </div>
        )}
        <div className="nutrition-actions">
          {limitsOf(state).scans > 0 ? (
            <Button
              onClick={() => {
                setScanError("");
                setScanning(true);
              }}
            >
              <ScanBarcode size={16} />
              Scan a barcode
            </Button>
          ) : (
            <Link className="button" to="/plans">
              <ScanBarcode size={16} />
              Scan a barcode
              <PlusTag />
            </Link>
          )}
          <Button variant="secondary" onClick={() => setFood(emptyFood())}>
            <Plus size={16} />
            Add food
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setTargets(goal || { calories: 0, carbs: 0, protein: 0, fat: 0 })
            }
          >
            <Target size={16} />
            {goal ? "Edit targets" : "Set targets"}
          </Button>
          <Button variant="ghost" onClick={() => setCalculating(true)}>
            <Calculator size={16} />
            Calorie calculator
          </Button>
        </div>
        {shownExtras.length > 0 && (
          <details className="nutrient-totals">
            <summary>
              More nutrients
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <dl>
              {shownExtras.map((n) => (
                <div key={n.key}>
                  <dt>{n.label}</dt>
                  <dd>
                    {extraLabel(n, sum.extra[n.key])}
                    {goal?.extra?.[n.key] !== undefined && (
                      <small> / {extraLabel(n, goal.extra[n.key])}</small>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        )}
      </section>
      <section className="nutrition-meals" aria-labelledby="meals-title">
        <h3 id="meals-title">
          Eaten {date === today() ? "today" : "this day"}
        </h3>
        {meals.length ? (
          <ul className="meal-list">
            {meals.map((f) => (
              <li key={f.id}>
                <div>
                  <strong>{f.name}</strong>
                  <small>
                    {[
                      f.brand,
                      f.grams ? `${f.grams} g` : undefined,
                      f.source === "scan" ? "Scanned" : "Entered by you",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </small>
                </div>
                <span className="meal-macros">
                  <strong>{f.calories} kcal</strong>
                  <small>
                    C {f.carbs} · P {f.protein} · F {f.fat} g
                  </small>
                </span>
                <button
                  className="icon-button"
                  aria-label={`Edit ${f.name}`}
                  onClick={() => setFood(f)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${f.name}`}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      food: s.food.filter((x) => x.id !== f.id),
                    }))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="Nothing logged yet.">
            Scan a package or add what you ate.
          </Empty>
        )}
      </section>
      <section className="weight-card" aria-labelledby="weight-title">
        <header>
          <Scale size={20} aria-hidden="true" />
          <h3 id="weight-title">Weight</h3>
        </header>
        <div className="weight-stats">
          <div>
            <span>Latest</span>
            <strong>
              {lastKg !== undefined ? weightLabel(lastKg, unit) : "–"}
            </strong>
          </div>
          <div>
            <span>7-day average</span>
            <strong>{avg !== undefined ? weightLabel(avg, unit) : "–"}</strong>
          </div>
          <div>
            <span>Change vs last week</span>
            <strong>
              {avg !== undefined && weekBefore !== undefined
                ? `${avg - weekBefore >= 0 ? "+" : "−"}${fromKg(Math.abs(avg - weekBefore), unit)} ${unit}`
                : "–"}
            </strong>
          </div>
        </div>
        <WeightChart entries={latest} unit={unit} />
        <form
          className="weight-form"
          onSubmit={(e) => {
            e.preventDefault();
            const value = Number(weightValue);
            if (!value) return;
            const kg = toKg(value, unit);
            update((s) => ({
              ...s,
              weights: [
                ...s.weights.filter((w) => w.date !== weightDate),
                { id: uid(), date: weightDate, kg },
              ],
            }));
            setWeightValue("");
            toast("Weight logged.");
          }}
        >
          <Field
            label={`Weight (${unit})`}
            type="number"
            min="20"
            max={unit === "lb" ? 1000 : 450}
            step="0.1"
            required
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
          />
          <Field
            label="Weigh-in date"
            type="date"
            max={today()}
            required
            value={weightDate}
            onChange={(e) => setWeightDate(e.target.value)}
          />
          <Button type="submit">Log weight</Button>
        </form>
        {latest.length > 0 && (
          <details className="details">
            <summary>All weigh-ins ({latest.length})</summary>
            {[...latest].reverse().map((w) => (
              <div className="history-row" key={w.id}>
                <span>{dateLabel(w.date)}</span>
                <span>{weightLabel(w.kg, unit)}</span>
                <button
                  className="text-button"
                  aria-label={`Delete weigh-in ${dateLabel(w.date)}`}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      weights: s.weights.filter((x) => x.id !== w.id),
                    }))
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </details>
        )}
        <p className="small-text muted">
          Daily weight moves with water and food. The 7-day average shows the
          trend.
        </p>
      </section>

      {scanning && (
        <Modal title="Scan a barcode" onClose={() => setScanning(false)}>
          {scansLeft > 0 ? (
            <>
              <BarcodeScanner onCode={lookUp} busy={looking} />
              {Number.isFinite(scansLeft) && (
                <p className="small-text muted">
                  {scansLeft} of {limitsOf(state).scans} scans left today
                </p>
              )}
            </>
          ) : (
            <UpgradeCard
              title={`You’ve used today’s ${limitsOf(state).scans} scans`}
            >
              Signature has unlimited scans — or add the food yourself.
            </UpgradeCard>
          )}
          {scanError && (
            <p className="form-error" role="alert">
              {scanError}
            </p>
          )}
        </Modal>
      )}

      {food && (
        <Modal
          title={
            state.food.some((f) => f.id === food.id) ? "Edit food" : "Add food"
          }
          onClose={() => setFood(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                food: s.food.some((f) => f.id === food.id)
                  ? s.food.map((f) => (f.id === food.id ? food : f))
                  : [...s.food, food],
              }));
              setFood(null);
              toast("Food saved.");
            }}
          >
            {food.per100 && (
              <Notice>
                From Open Food Facts · per 100 g: {food.per100.calories} kcal.
                Change the amount and the values follow; you can still edit
                them.
              </Notice>
            )}
            <Field
              label="Food or meal"
              required
              maxLength={120}
              value={food.name}
              onChange={(e) => setFood({ ...food, name: e.target.value })}
            />
            <div className="form-grid">
              <Field
                label="Amount (g, optional)"
                type="number"
                min="0"
                max="5000"
                step="any"
                value={food.grams ?? ""}
                onChange={(e) => {
                  const grams = numberOrUndefined(e.target.value);
                  setFood(
                    food.per100 && grams !== undefined
                      ? { ...food, grams, ...scaleTo(food.per100, grams) }
                      : { ...food, grams },
                  );
                }}
              />
              <Field
                label="Date"
                type="date"
                required
                max={today()}
                value={food.date}
                onChange={(e) => setFood({ ...food, date: e.target.value })}
              />
            </div>
            <div className="form-grid macro-inputs">
              {macroFields.map((m) => (
                <Field
                  key={m.key}
                  label={`${m.label} (${m.unit})`}
                  type="number"
                  min="0"
                  max={m.key === "calories" ? 20000 : 2000}
                  step="any"
                  required
                  value={food[m.key]}
                  onChange={(e) =>
                    setFood({ ...food, [m.key]: Number(e.target.value) })
                  }
                />
              ))}
            </div>
            <ExtraFields
              summary="More nutrients (optional)"
              values={food.extra || {}}
              onChange={(extra) => setFood({ ...food, extra })}
            />
            <Button type="submit">Save food</Button>
          </form>
        </Modal>
      )}

      {targets && (
        <Modal title="Your daily targets" onClose={() => setTargets(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({ ...s, nutritionTargets: targets }));
              setTargets(null);
              toast("Targets saved.");
            }}
          >
            <p className="small-text muted">
              You decide these. Calories, carbs, protein and fat are needed;
              everything else is optional.
            </p>
            <div className="form-grid macro-inputs">
              {macroFields.map((m) => (
                <Field
                  key={m.key}
                  label={`Daily ${m.label.toLowerCase()} (${m.unit})`}
                  type="number"
                  min={m.key === "calories" ? 1 : 0}
                  max={m.key === "calories" ? 15000 : 2000}
                  step="any"
                  required
                  value={targets[m.key] || ""}
                  onChange={(e) =>
                    setTargets({ ...targets, [m.key]: Number(e.target.value) })
                  }
                />
              ))}
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setTargets(null);
                setCalculating(true);
              }}
            >
              Not sure about calories? Use the calculator.
            </button>
            <ExtraFields
              summary="Other nutrients (optional)"
              values={targets.extra || {}}
              onChange={(extra) => setTargets({ ...targets, extra })}
            />
            <Button type="submit">Save targets</Button>
          </form>
        </Modal>
      )}

      {calculating && (
        <Modal title="Calorie calculator" onClose={() => setCalculating(false)}>
          <div className="calculator">
            <div className="form-grid">
              <Select
                label="Sex"
                value={calc.sex}
                onChange={(e) =>
                  setCalc({
                    ...calc,
                    sex: e.target.value as CalorieInput["sex"],
                  })
                }
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
              <Field
                label="Age"
                type="number"
                min="13"
                max="100"
                value={calc.age}
                onChange={(e) =>
                  setCalc({ ...calc, age: Number(e.target.value) })
                }
              />
              {heightUnit === "cm" ? (
                <Field
                  label="Height (cm)"
                  type="number"
                  min="120"
                  max="230"
                  value={Math.round(calc.heightCm)}
                  onChange={(e) =>
                    setCalc({ ...calc, heightCm: Number(e.target.value) })
                  }
                />
              ) : (
                <div className="height-ft">
                  <Field
                    label="Height (ft)"
                    type="number"
                    min="4"
                    max="7"
                    value={height.feet}
                    onChange={(e) =>
                      setCalc({
                        ...calc,
                        heightCm: cmFromFeet(
                          Number(e.target.value),
                          height.inches,
                        ),
                      })
                    }
                  />
                  <Field
                    label="Height (in)"
                    type="number"
                    min="0"
                    max="11"
                    value={height.inches}
                    onChange={(e) =>
                      setCalc({
                        ...calc,
                        heightCm: cmFromFeet(
                          height.feet,
                          Number(e.target.value),
                        ),
                      })
                    }
                  />
                </div>
              )}
              <Field
                label={`Weight (${unit})`}
                type="number"
                min="30"
                max={unit === "lb" ? 1000 : 450}
                step="0.1"
                value={fromKg(calc.weightKg, unit)}
                onChange={(e) =>
                  setCalc({
                    ...calc,
                    weightKg: toKg(Number(e.target.value), unit),
                  })
                }
              />
            </div>
            <Select
              label="Activity"
              value={calc.activity}
              onChange={(e) =>
                setCalc({ ...calc, activity: e.target.value as Activity })
              }
            >
              {Object.entries(activityLevels).map(([id, level]) => (
                <option key={id} value={id}>
                  {level.label}
                </option>
              ))}
            </Select>
            <Select
              label="Goal"
              value={estimate.goal}
              disabled={estimate.minor}
              onChange={(e) =>
                setCalc({ ...calc, goal: e.target.value as CalorieGoal })
              }
            >
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain weight</option>
            </Select>
            {estimate.minor && (
              <Notice>
                Under 18 the calculator only shows maintenance. Growing bodies
                need enough energy — talk to a doctor before trying to lose
                weight.
              </Notice>
            )}
            <dl className="calc-results" aria-live="polite">
              <div>
                <dt>At rest</dt>
                <dd>{estimate.bmr} kcal</dd>
              </div>
              <div>
                <dt>Maintenance</dt>
                <dd>{estimate.maintenance} kcal</dd>
              </div>
              <div className="calc-target">
                <dt>Suggested daily target</dt>
                <dd>{estimate.target} kcal</dd>
              </div>
            </dl>
            {estimate.floored && (
              <p className="small-text muted">
                We don’t suggest less than {calorieFloor(calc.sex)} kcal a day
                without a doctor or dietitian.
              </p>
            )}
            <p className="small-text muted">
              An estimate (Mifflin-St Jeor). Watch your 7-day average weight for
              two to three weeks and adjust by about 100–200 kcal.{" "}
              <Link to="/topics/nutrition/guide/weight">
                Read the weight guide
              </Link>
            </p>
            <Button
              onClick={() => {
                setCalculating(false);
                setTargets({
                  ...(goal || { carbs: 0, protein: 0, fat: 0 }),
                  calories: estimate.target,
                });
                toast(
                  "Calories filled in. Now set your carbs, protein and fat.",
                );
              }}
            >
              Use as my calorie target
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
