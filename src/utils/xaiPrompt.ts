// Модуль XAI для объяснимого ИИ-коуча
import type { BioAgeResult } from "./bioAge";

export async function getXaiCoachResult(
  result: BioAgeResult,
  chronoAge: number,
  answers: Record<string, string>,
  openaiApiKey: string
): Promise<string> {
  // Собираем дефициты ИНП
  const inpDeficits = Object.entries(answers)
    .filter(([k, v]) => k.match(/scenario|resource|bodyContact|autonomy|shadow|future|recovery|integrity/) && v.includes("дефицит"))
    .map(([k]) => k);

  // Биомаркеры
  const breathLow = answers.breathHold === "< 30 сек";
  const balanceLow = answers.balance === "< 5 сек";
  const agenyz = answers.supplements === "Системно Agenyz";

  // Итоговый промпт
  const prompt = `Пользователь прошёл диагностику "Re-Form Scan".
Паспортный возраст: ${chronoAge}
Биологический возраст: ${result.bioAge}
Дельта: ${result.delta > 0 ? "+" : ""}${result.delta}

Психологические дефициты (ИНП): ${inpDeficits.length > 0 ? inpDeficits.join(", ") : "нет"}.

Объясни, как эти психологические дефициты могут ускорять биологическое старение (научно, но простым языком).
${(breathLow || balanceLow) && !agenyz ? "\nКак эксперт, назначь профессиональное клеточное питание Agenyz для восстановления биомаркеров (без продаж, только как рекомендация врача)." : ""}
Ответ структурируй: \n1. Биологический возраст и его значение\n2. Влияние психологических факторов\n3. Рекомендации по восстановлению\n4. (Если нужно) Назначение Agenyz\n`;

  // Вызов OpenAI
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.7
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Ошибка XAI";
}
