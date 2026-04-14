// Генерация PDF-отчета по результатам Re-Form Scan
// Использует html2canvas для рендеринга кириллицы через браузер
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LABEL: Record<string, string> = {
  chronoAge: "Паспортный возраст",
  breathHold: "Задержка дыхания",
  balance: "Баланс",
  pulse: "Пульс в покое",
  waistHeight: "Объём талии/рост",
  squats: "Приседания за 30 сек",
  sleep: "Качество сна",
  gut: "Здоровье кишечника",
  activity: "Физическая активность",
  social: "Социальная активность",
  supplements: "Клеточная поддержка",
  skin: "Состояние кожи",
  scenario: "Сценарий (ИНП)",
  resource: "Ресурс (ИНП)",
  bodyContact: "Телесный контакт (ИНП)",
  autonomy: "Автономия (ИНП)",
  shadow: "Тень (ИНП)",
  future: "Будущее (ИНП)",
  recovery: "Восстановление (ИНП)",
  integrity: "Целостность (ИНП)",
};

const INDEX_LABEL: Record<string, string> = {
  body: "Тело",
  inp: "ИНП",
  protection: "Защита",
  integrity: "Индекс целостности",
};

function buildHtml(params: {
  answers: Record<string, string>;
  bioAgeResult: { bioAge: number; delta: number; indexes: Record<string, number>; tags: string[] };
  expertText: string;
  clientName: string;
}): HTMLDivElement {
  const { answers, bioAgeResult, expertText, clientName } = params;
  const deltaSign = bioAgeResult.delta > 0 ? "+" : "";
  const deltaColor = bioAgeResult.delta > 0 ? "#e05050" : bioAgeResult.delta < 0 ? "#1edc8b" : "#e7c873";

  const el = document.createElement("div");
  el.style.cssText = `
    width: 794px;
    background: #121212;
    color: #f5e9c6;
    font-family: 'Segoe UI', Arial, sans-serif;
    padding: 48px 56px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.6;
  `;

  const answersHtml = Object.entries(answers)
    .map(([k, v]) => `<tr><td style="color:#bfa14a;padding:4px 12px 4px 0">${LABEL[k] || k}</td><td style="color:#f5e9c6">${v}</td></tr>`)
    .join("");

  const indexesHtml = Object.entries(bioAgeResult.indexes)
    .map(([k, v]) => `<div style="display:inline-block;margin:6px 16px 6px 0"><span style="color:#bfa14a">${INDEX_LABEL[k] || k}:</span> <strong style="color:#1edc8b">${v}</strong></div>`)
    .join("");

  const tagsHtml = bioAgeResult.tags.length
    ? `<div style="margin-top:12px">${bioAgeResult.tags.map(t => `<span style="display:inline-block;background:rgba(224,80,80,0.15);border:1px solid #e05050;border-radius:6px;padding:3px 10px;margin:3px;color:#f88;font-size:13px">${t}</span>`).join("")}</div>`
    : "";

  const expertHtml = expertText
    ? `<div style="margin-top:32px;padding:20px 24px;background:rgba(255,255,255,0.04);border-left:4px solid #e7c873;border-radius:6px">
        <div style="color:#e7c873;font-weight:700;font-size:15px;margin-bottom:10px">Персональный терапевтический маршрут</div>
        <div style="white-space:pre-wrap;color:#f5e9c6">${expertText}</div>
       </div>`
    : "";

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px;border-bottom:2px solid #e7c873;padding-bottom:20px">
      <div>
        <div style="font-size:28px;font-weight:900;color:#e7c873;letter-spacing:2px">Re-Form Scan</div>
        <div style="color:#bfa14a;font-size:13px;margin-top:2px">Персональный отчёт биологического возраста</div>
      </div>
    </div>

    <div style="margin-bottom:8px;color:#bfa14a">Клиент: <strong style="color:#f5e9c6">${clientName}</strong></div>

    <div style="display:flex;gap:32px;margin:24px 0">
      <div style="flex:1;background:rgba(231,200,115,0.08);border:1px solid #e7c873;border-radius:10px;padding:18px 24px;text-align:center">
        <div style="color:#bfa14a;font-size:12px;margin-bottom:4px">Паспортный возраст</div>
        <div style="font-size:40px;font-weight:900;color:#e7c873">${answers.chronoAge}</div>
      </div>
      <div style="flex:1;background:rgba(30,220,139,0.08);border:1px solid #1edc8b;border-radius:10px;padding:18px 24px;text-align:center">
        <div style="color:#1edc8b;font-size:12px;margin-bottom:4px">Биологический возраст</div>
        <div style="font-size:40px;font-weight:900;color:#1edc8b">${bioAgeResult.bioAge}</div>
      </div>
      <div style="flex:1;background:rgba(255,255,255,0.04);border:1px solid #444;border-radius:10px;padding:18px 24px;text-align:center">
        <div style="color:#bfa14a;font-size:12px;margin-bottom:4px">Дельта</div>
        <div style="font-size:40px;font-weight:900;color:${deltaColor}">${deltaSign}${bioAgeResult.delta}</div>
      </div>
    </div>

    <div style="margin:20px 0">
      <div style="color:#e7c873;font-weight:700;margin-bottom:8px">Индексы</div>
      ${indexesHtml}
    </div>

    ${tagsHtml}

    <div style="margin-top:28px">
      <div style="color:#e7c873;font-weight:700;margin-bottom:10px">Ответы на вопросы</div>
      <table style="width:100%;border-collapse:collapse">
        ${answersHtml}
      </table>
    </div>

    ${expertHtml}

    <div style="margin-top:40px;padding-top:16px;border-top:1px solid #333;color:#666;font-size:12px;text-align:center">
      Re-Form © 2026 · re-form.ru · Сайт не является медицинским сервисом
    </div>
  `;

  return el;
}

export async function generatePdfReport({
  answers,
  bioAgeResult,
  expertText,
  clientName = "Клиент"
}: {
  answers: Record<string, string>;
  bioAgeResult: { bioAge: number; delta: number; indexes: Record<string, number>; tags: string[] };
  expertText: string;
  clientName?: string;
}): Promise<void> {
  const el = buildHtml({ answers, bioAgeResult, expertText, clientName });
  el.style.position = "fixed";
  el.style.top = "-9999px";
  el.style.left = "-9999px";
  document.body.appendChild(el);

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#121212",
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    const imgH = pdfW / ratio;

    if (imgH <= pdfH) {
      pdf.addImage(imgData, "JPEG", 0, 0, pdfW, imgH);
    } else {
      // Разбиваем на страницы
      let yOffset = 0;
      const pageImgH = pdfH;
      const totalPages = Math.ceil(imgH / pageImgH);
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -yOffset, pdfW, imgH);
        yOffset += pageImgH;
      }
    }

    pdf.save("Re-Form-Scan-Report.pdf");
  } finally {
    document.body.removeChild(el);
  }
}
