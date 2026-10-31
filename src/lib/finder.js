// The plan finder: four answers in, a starting mix of classes out.
import { PROGRAMS } from "../data/gym.js";

export const QUESTIONS = [
  { id: "goal", options: ["muscle", "fat", "fit", "fight", "calm"] },
  { id: "who", options: ["men", "women", "kids"] },
  { id: "days", options: [2, 3, 4] },
  { id: "months", options: [1, 3, 6, 12] },
];

// Classes that suit each goal, best first
const RANKING = {
  muscle: ["fitness"],
  fat: ["zumba", "kickboxing", "fitness", "aerobics", "dance"],
  fit: ["fitness", "aerobics", "kickboxing", "zumba", "mma"],
  fight: ["kickboxing", "mma"],
  calm: ["yoga", "dance", "zumba"],
};

// The machines suit these goals; kids train in classes
const FLOOR_GOALS = ["muscle", "fat", "fit"];

const program = (id) => PROGRAMS.find((p) => p.id === id);

export function recommend({ goal, who, days, months }) {
  let classes = RANKING[goal].filter((id) => program(id).for.includes(who)).slice(0, 3);
  const floor = who !== "kids" && FLOOR_GOALS.includes(goal);
  // Nothing fits (e.g. men who want to unwind: those classes are for women), so start with Fitness, open to everyone
  if (!classes.length) classes = ["fitness"];
  const recover = who !== "kids" && (goal === "calm" || goal === "muscle");
  return { classes, floor, recover, days, months };
}

// The WhatsApp message the visitor sends, in their language (t, pick and f come from useI18n)
export function joinMessage(answers, result, { t, pick, f }) {
  const lines = [
    t("msg.join"),
    t("msg.goal", { v: t(`goal.${answers.goal}`) }),
    t("msg.who", { v: t(`aud.${answers.who}`) }),
    t("msg.days", { v: t(`days.${answers.days}`) }),
    t("msg.plan", { v: t("months", { n: answers.months }) }),
    t("msg.classes", { v: f.list(result.classes.map((id) => pick(program(id).name))) }),
  ];
  return lines.join("\n");
}
