// Результат расчёта биологического возраста с 4 индексами
export interface BioAgeResult {
  bioAge: number;
  delta: number;
  indexes: {
    body: number;
    inp: number;
    protection: number;
    integrity: number;
  };
  tags: string[];
}

// Формула: Age_bio = Age_chrono + Σ Δw
// Ключи для блоков
const bodyKeys = [
  "breathHold", "balance", "pulse", "waistHeight", "squats", "sleep", "gut", "activity", "social", "supplements", "skin"
];
const inpKeys = [
  "scenario", "resource", "bodyContact", "autonomy", "shadow", "future", "recovery", "integrity"
];

// Веса для тела
const bodyWeights: Record<string, (val: string) => number> = {
  breathHold: v => v === "< 30 сек" ? 3.5 : v === "30–45 сек" ? 2 : v === "46–60 сек" ? 0 : -1.5,
  balance: v => v === "< 5 сек" ? 3 : v === "5–15 сек" ? 2 : v === "16–30 сек" ? 1 : 0,
  pulse: v => v === ">80" ? 2 : v === "70–80" ? 1 : v === "60–70" ? 0 : -1,
  waistHeight: v => v === ">0.5" ? 2.5 : v === "0.48–0.5" ? 1.5 : v === "0.45–0.47" ? 0.5 : 0,
  squats: v => v === "< 15" ? 2 : v === "15–20" ? 1 : v === "21–30" ? 0 : -1,
  sleep: v => v === "Плохое" ? 2 : v === "Среднее" ? 1 : 0,
  gut: v => v === "Частые жалобы" ? 1.5 : v === "Редко" ? 0.5 : 0,
  activity: v => v === "< 3000" ? 2 : v === "3000–7000" ? 1 : v === "7000–10000" ? 0 : -1,
  social: v => v === "Малоподвижный / замкнутый" ? 1.5 : v === "Средний уровень" ? 0.5 : 0,
  supplements: v => v === "Нет поддержки" ? 2 : v === "Другие бренды" ? 0 : 0,
  skin: v => v === "Сухая/тусклая" ? 1 : v === "Нормальная" ? 0 : -1,
};

// Веса для ИНП
function inpWeight(val: string): number {
  if (val.includes("дефицит")) return 1.2;
  if (val.includes("ресурс")) return -0.8;
  return 0;
}

// Вклад защиты
function protectionWeight(val: string): number {
  if (val === "Системно Agenyz") return -3;
  if (val === "Нет поддержки") return 2;
  return 0;
}

// Индекс целостности (по совпадению "ресурсных" ответов в ИНП)
function calcIntegrity(answers: Record<string, string>): number {
  let score = 0;
  let max = inpKeys.length;
  inpKeys.forEach(k => {
    if (answers[k] && answers[k].includes("ресурс")) score++;
  });
  return Math.round((score / max) * 100);
}

export function calculateBioAge(chronoAge: number, answers: Record<string, string>): number {
  return calcFullResult(chronoAge, answers).bioAge;
}

export function calcFullResult(chronoAge: number, answers: Record<string, string>): BioAgeResult {
  let deltaBody = 0;
  let deltaInp = 0;
  let tags: string[] = [];

  // Сумма по телу
  bodyKeys.forEach(k => {
    if (answers[k] && bodyWeights[k]) deltaBody += bodyWeights[k](answers[k]);
  });

  // Сумма по ИНП
  inpKeys.forEach(k => {
    if (answers[k]) deltaInp += inpWeight(answers[k]);
  });

  // Защита
  const prot = answers["supplements"] || "";
  const cellularProtection = protectionWeight(prot);

  // Теги
  if ((answers["breathHold"] === "< 30 сек" || answers["balance"] === "< 5 сек") && prot !== "Системно Agenyz") {
    tags.push("Рекомендуется клеточная поддержка Agenyz для восстановления биомаркеров");
  }

  // Индексы
  const bodyIndex = Math.max(0, 100 - deltaBody * 10);
  const inpIndex = Math.max(0, 100 - deltaInp * 10);
  const protectionIndex = prot === "Системно Agenyz" ? 100 : prot === "Другие бренды" ? 60 : 30;
  const integrityIndex = calcIntegrity(answers);

  const bioAge = Math.round((chronoAge + deltaBody + deltaInp - cellularProtection) * 10) / 10;

  return {
    bioAge,
    delta: Math.round((bioAge - chronoAge) * 10) / 10,
    indexes: {
      body: bodyIndex,
      inp: inpIndex,
      protection: protectionIndex,
      integrity: integrityIndex
    },
    tags
  };
}


