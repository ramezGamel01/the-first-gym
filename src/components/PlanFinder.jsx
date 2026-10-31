import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "../i18n/context.js";
import { PLANS } from "../data/gym.js";
import { joinMessage, QUESTIONS, recommend } from "../lib/finder.js";
import { whatsappHref } from "../lib/contact.js";
import { ExtLink, ProgramTimes, Tbc, WhatsAppIcon } from "./bits.jsx";
import { coachById, programById } from "../lib/lookup.js";

function optionLabel(t, question, option) {
  if (question === "goal") return t(`goal.${option}`);
  if (question === "who") return t(`aud.${option}`);
  if (question === "days") return t(`days.${option}`);
  return t("months", { n: option });
}

export default function PlanFinder() {
  const i18n = useI18n();
  const { t, pick } = i18n;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const focusTarget = useRef(null);
  const moved = useRef(false);

  // Each new question (and the result) takes focus, so keyboard and screen reader users follow along
  useEffect(() => {
    if (moved.current) focusTarget.current?.focus();
  }, [step, done]);

  const go = (next) => {
    moved.current = true;
    next();
  };

  if (done) {
    const result = recommend(answers);
    const plan = PLANS.find((p) => p.months === answers.months);
    return (
      <div className="finder finder--result">
        <h3 className="finder__title" tabIndex={-1} ref={focusTarget}>
          {t("result.title")}
        </h3>
        <h4 className="finder__label">{t("result.classes")}</h4>
        <ul className="finder__classes">
          {result.classes.map((id) => {
            const program = programById(id);
            const coach = coachById(program.coach);
            return (
              <li key={id}>
                <Check aria-hidden="true" />
                <div>
                  <strong>{pick(program.name)}</strong>
                  {coach && <span className="finder__coach">{pick(coach.name)}</span>}
                  <span className="finder__times">
                    <ProgramTimes id={id} />
                  </span>
                </div>
              </li>
            );
          })}
          {result.floor && (
            <li>
              <Check aria-hidden="true" />
              <div>{t("result.floor")}</div>
            </li>
          )}
          {result.recover && (
            <li>
              <Check aria-hidden="true" />
              <div>{t("result.recover")}</div>
            </li>
          )}
        </ul>
        <p className="finder__week">{t("result.week", { days: t(`week.${answers.days}`) })}</p>
        <dl className="finder__plan">
          <dt>{t("result.plan")}</dt>
          <dd>{t("months", { n: answers.months })}</dd>
          <dt>{t("plan.price")}</dt>
          <dd>{plan.price ? t("egp", { n: plan.price }) : <Tbc />}</dd>
        </dl>
        <div className="finder__actions">
          <ExtLink className="btn btn--volt" href={whatsappHref(joinMessage(answers, result, i18n))}>
            <WhatsAppIcon />
            {t("result.send")}
          </ExtLink>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() =>
              go(() => {
                setAnswers({});
                setStep(0);
                setDone(false);
              })
            }
          >
            {t("finder.restart")}
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[step];
  const last = step === QUESTIONS.length - 1;
  const answered = answers[question.id] !== undefined;

  return (
    <form
      className="finder"
      onSubmit={(e) => {
        e.preventDefault();
        if (!answered) return;
        go(() => (last ? setDone(true) : setStep(step + 1)));
      }}
    >
      <ol className="finder__progress" aria-hidden="true">
        {QUESTIONS.map((q, i) => (
          <li key={q.id} className={i <= step ? "is-done" : undefined} />
        ))}
      </ol>
      <fieldset key={question.id}>
        <legend>
          <span className="finder__step">{t("finder.step", { n: step + 1, total: QUESTIONS.length })}</span>
          <span className="finder__q" tabIndex={-1} ref={focusTarget}>
            {t(`q.${question.id}`)}
          </span>
        </legend>
        <div className="options">
          {question.options.map((option) => (
            <label className="option" key={option}>
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => setAnswers((a) => ({ ...a, [question.id]: option }))}
              />
              <span>{optionLabel(t, question.id, option)}</span>
              <Check className="option__check" aria-hidden="true" />
            </label>
          ))}
        </div>
      </fieldset>
      <div className="finder__actions">
        {step > 0 && (
          <button type="button" className="btn btn--ghost" onClick={() => go(() => setStep(step - 1))}>
            {t("finder.back")}
          </button>
        )}
        <button type="submit" className="btn btn--volt" disabled={!answered}>
          {last ? t("finder.show") : t("finder.next")}
        </button>
      </div>
    </form>
  );
}
