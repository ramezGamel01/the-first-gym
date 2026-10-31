import { useId, useState } from "react";
import { ScanLine } from "lucide-react";
import { useI18n, usePageTitle } from "../i18n/context.js";
import { ACTIVITY, BMI_BANDS, bmi, bmiBand, check, dailyCalories, LIMITS, proteinRange } from "../lib/body.js";
import { whatsappHref } from "../lib/contact.js";
import { ExtLink } from "../components/bits.jsx";

const SCALE = { min: 15, max: 40 };
const toScale = (value) => Math.min(100, Math.max(0, ((value - SCALE.min) / (SCALE.max - SCALE.min)) * 100));

function BmiScale({ value }) {
  const { f } = useI18n();
  return (
    <div className="scale" aria-hidden="true">
      <div className="scale__bands">
        {BMI_BANDS.map((band) => (
          <span
            key={band.id}
            className={`scale__band scale__band--${band.id}`}
            style={{ flexGrow: Math.min(band.max, SCALE.max) - Math.max(band.min, SCALE.min) }}
          />
        ))}
      </div>
      <span className="scale__marker" style={{ insetInlineStart: `${toScale(value)}%` }} />
      <div className="scale__ticks">
        {BMI_BANDS.slice(1).map((band) => (
          <span key={band.id} style={{ insetInlineStart: `${toScale(band.min)}%` }}>
            {f.number(band.min)}
          </span>
        ))}
      </div>
    </div>
  );
}

function NumberField({ field, label, unit, value, onChange, state }) {
  const { t } = useI18n();
  const id = useId();
  const invalid = state && !state.ok && !(field === "age" && state.value !== null && state.value < LIMITS.age.min);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={onChange}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
        />
        <span className="input__unit">{unit}</span>
      </div>
      {invalid && (
        <p className="field__error" id={`${id}-error`}>
          {t("lab.range", { min: LIMITS[field].min, max: LIMITS[field].max })}
        </p>
      )}
    </div>
  );
}

function Choice({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="field">
      <legend>{legend}</legend>
      <div className="segmented">
        {options.map((o) => (
          <label key={o.value} className="segmented__option">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function BodyLab() {
  const { t } = useI18n();
  usePageTitle("lab.title");
  const activityId = useId();
  const [form, setForm] = useState({ sex: "male", age: "", height: "", weight: "", activity: "moderate", goal: "maintain" });
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));
  const fromInput = (key) => (e) => set(key)(e.target.value);

  const age = check("age", form.age);
  const height = check("height", form.height);
  const weight = check("weight", form.weight);
  const teen = age && age.value !== null && age.value < LIMITS.age.min;
  const ready = age?.ok && height?.ok && weight?.ok;

  let results = null;
  if (ready) {
    const input = { sex: form.sex, age: age.value, height: height.value, weight: weight.value, activity: form.activity, goal: form.goal };
    const value = bmi(weight.value, height.value);
    results = { bmi: value, band: bmiBand(value), calories: dailyCalories(input), protein: proteinRange(weight.value) };
  }

  return (
    <>
      <header className="page-head">
        <div className="shell">
          <h1 tabIndex={-1}>{t("lab.title")}</h1>
          <p>{t("lab.lede")}</p>
        </div>
      </header>

      <section className="section" aria-label={t("lab.title")}>
        <div className="shell lab">
          <form className="lab__form" onSubmit={(e) => e.preventDefault()} aria-label={t("lab.inputs")}>
            <Choice
              name="sex"
              legend={t("lab.sex")}
              value={form.sex}
              onChange={set("sex")}
              options={[
                { value: "male", label: t("lab.male") },
                { value: "female", label: t("lab.female") },
              ]}
            />
            <div className="lab__row">
              <NumberField field="age" label={t("lab.age")} unit={t("lab.years")} value={form.age} onChange={fromInput("age")} state={age} />
              <NumberField field="height" label={t("lab.height")} unit={t("lab.cm")} value={form.height} onChange={fromInput("height")} state={height} />
              <NumberField field="weight" label={t("lab.weight")} unit={t("lab.kg")} value={form.weight} onChange={fromInput("weight")} state={weight} />
            </div>
            <div className="field">
              <label htmlFor={activityId}>{t("lab.activity")}</label>
              <select id={activityId} className="select" value={form.activity} onChange={fromInput("activity")}>
                {Object.keys(ACTIVITY).map((level) => (
                  <option key={level} value={level}>
                    {t(`act.${level}`)}
                  </option>
                ))}
              </select>
            </div>
            <Choice
              name="goal"
              legend={t("lab.goal")}
              value={form.goal}
              onChange={set("goal")}
              options={[
                { value: "lose", label: t("lab.lose") },
                { value: "maintain", label: t("lab.maintain") },
                { value: "gain", label: t("lab.gain") },
              ]}
            />
          </form>

          <div className="lab__results">
            {results ? (
              <Readouts results={results} />
            ) : (
              <p className="lab__empty">{teen ? t("lab.teen") : t("lab.empty")}</p>
            )}
            <p className="lab__note">{t("lab.note")}</p>
            <ExtLink className="btn btn--volt" href={whatsappHref(t("msg.inbody"))}>
              <ScanLine aria-hidden="true" />
              {t("lab.inbody")}
            </ExtLink>
          </div>
        </div>
      </section>
    </>
  );
}

function Readouts({ results }) {
  const { t, f } = useI18n();
  return (
    <>
      <section className="readout" aria-labelledby="readout-bmi">
        <h2 className="readout__label" id="readout-bmi">
          {t("lab.bmi")}
        </h2>
        <p className="readout__value">{f.decimal(results.bmi)}</p>
        <p className="readout__band">{t(`band.${results.band}`)}</p>
        <BmiScale value={results.bmi} />
      </section>
      <section className="readout" aria-labelledby="readout-cal">
        <h2 className="readout__label" id="readout-cal">
          {t("lab.calories")}
        </h2>
        <dl className="readout__pair">
          <div>
            <dt>{t("lab.forMaintain")}</dt>
            <dd>{t("lab.kcal", { n: results.calories.maintain })}</dd>
          </div>
          <div>
            <dt>{t("lab.forGoal")}</dt>
            <dd>{t("lab.kcal", { n: results.calories.target })}</dd>
          </div>
        </dl>
      </section>
      <section className="readout" aria-labelledby="readout-protein">
        <h2 className="readout__label" id="readout-protein">
          {t("lab.protein")}
        </h2>
        <p className="readout__value readout__value--small">
          {t("lab.proteinRange", { min: results.protein[0], max: results.protein[1] })}
        </p>
      </section>
    </>
  );
}
