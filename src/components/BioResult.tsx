import React, { useEffect, useState } from "react";
import { calcFullResult } from "../utils/bioAge";
import type { BioAgeResult } from "../utils/bioAge";
import { generatePdfReport } from "../utils/pdfReport";

interface BioResultProps {
  answers: Record<string, string>;
  onRestart: () => void;
}

export const BioResult: React.FC<BioResultProps> = ({ answers, onRestart }) => {
  const chronoAge = Number(answers.chronoAge);
  const [bioAge, setBioAge] = useState(chronoAge);
  const [result, setResult] = useState<BioAgeResult | null>(null);
  const delta = Math.round((bioAge - chronoAge) * 10) / 10;

  useEffect(() => {
    const res = calcFullResult(chronoAge, answers);
    setResult(res);
    let current = chronoAge;
    const step = res.bioAge > chronoAge ? 1 : -1;
    const interval = setInterval(() => {
      current += step;
      setBioAge(current);
      if ((step > 0 && current >= res.bioAge) || (step < 0 && current <= res.bioAge)) {
        setBioAge(res.bioAge);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [chronoAge, answers]);

  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleDownloadPdf() {
    if (!result || pdfLoading) return;
    setPdfLoading(true);
    try {
      await generatePdfReport({
        answers,
        bioAgeResult: result,
        expertText: "",
        clientName: "Клиент"
      });
    } finally {
      setPdfLoading(false);
    }
  }

  // Краткий итог для Telegram
  const shortSummary = result
    ? `Паспортный: ${chronoAge}, Биологический: ${result.bioAge}, Индекс целостности: ${result.indexes.integrity}`
    : "";
  const tgLink = `https://t.me/ReFormPsy_bot?start=${encodeURIComponent(shortSummary)}`;

  return (
    <main style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 520, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        border: "2px solid #e7c873",
        borderRadius: 18,
        boxShadow: "0 4px 32px #0008",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16
      }}>
        {/* Две шкалы: паспортный и биологический возраст */}
        <div style={{ width: "100%", display: "flex", gap: 18, justifyContent: "center", alignItems: "flex-end", marginBottom: 12 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "#bfa14a", fontWeight: 700, fontSize: "1em", marginBottom: 4 }}>Паспортный</div>
            <div style={{ fontSize: "2.7em", fontWeight: 800, color: "#e7c873", lineHeight: 1 }}>{chronoAge}</div>
            <div style={{ height: 7, background: "#1a2a1a", borderRadius: 99, margin: "8px 0" }}>
              <div style={{ height: 7, background: "#e7c873", borderRadius: 99, width: "100%" }} />
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "#1edc8b", fontWeight: 700, fontSize: "1em", marginBottom: 4 }}>Биологический</div>
            <div style={{ fontSize: "3.2em", fontWeight: 900, color: "#1edc8b", lineHeight: 1 }}>{bioAge}</div>
            <div style={{ height: 7, background: "#1a2a1a", borderRadius: 99, margin: "8px 0" }}>
              <div style={{ height: 7, background: "#1edc8b", borderRadius: 99, width: `${Math.min(100, Math.max(0, 100 - Math.abs(bioAge-chronoAge)*2))}%` }} />
            </div>
          </div>
        </div>

        {/* Дельта */}
        <div style={{ fontSize: "1.1em", fontWeight: 600, color: "#f5e9c6" }}>
          Дельта:&nbsp;
          <span style={{ color: delta > 0 ? "#ff6b6b" : delta < 0 ? "#1edc8b" : "#e7c873", fontWeight: 800 }}>
            {delta > 0 ? "+" : ""}{delta}
          </span>
        </div>

        {/* Теги-предупреждения */}
        {result && result.tags.length > 0 && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {result.tags.map(tag => (
              <div key={tag} style={{
                background: "rgba(255,80,80,0.13)",
                border: "1.5px solid #ff6b6b",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#ff6b6b",
                fontWeight: 700,
                fontSize: "0.9em",
                textAlign: "center"
              }}>&#9888; {tag}</div>
            ))}
          </div>
        )}

        {/* Индекс целостности и 3 индекса */}
        {result && (
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div style={{
              background: "rgba(0,0,0,0.35)",
              borderRadius: 12,
              padding: "12px 14px",
              gridColumn: "1/3"
            }}>
              <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: "0.9em", marginBottom: 6 }}>Индекс целостности</div>
              <div style={{ height: 7, background: "#1a2a1a", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: 7, background: "#a78bfa", borderRadius: 99, width: `${result.indexes.integrity}%`, transition: "width 1.2s ease" }} />
              </div>
              <div style={{ color: "#f5e9c6", fontSize: "1.15em", fontWeight: 800, marginTop: 5 }}>{result.indexes.integrity}</div>
            </div>
            {[
              { label: "Тело", value: result.indexes.body, color: "#1edc8b" },
              { label: "ИНП", value: result.indexes.inp, color: "#f59e0b" },
              { label: "Защита", value: result.indexes.protection, color: "#e7c873" },
            ].map(idx => (
              <div key={idx.label} style={{
                background: "rgba(0,0,0,0.35)",
                borderRadius: 12,
                padding: "12px 14px"
              }}>
                <div style={{ color: idx.color, fontWeight: 700, fontSize: "0.8em", marginBottom: 6, letterSpacing: 0.5 }}>{idx.label}</div>
                <div style={{ height: 7, background: "#1a2a1a", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: 7, background: idx.color, borderRadius: 99, width: `${idx.value}%`, transition: "width 1.2s ease" }} />
                </div>
                <div style={{ color: "#f5e9c6", fontSize: "1.15em", fontWeight: 800, marginTop: 5 }}>{idx.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* XAI рекомендации */}
        <div style={{
          width: "100%",
          background: "rgba(30,220,139,0.06)",
          border: "1px solid rgba(30,220,139,0.25)",
          borderRadius: 12,
          padding: "16px 18px",
          color: "#f5e9c6",
          fontSize: "0.97em",
          lineHeight: 1.6,
          textAlign: "center"
        }}>
          🤖 Персональный ИИ-анализ и рекомендации придут в Telegram после нажатия кнопки ниже
        </div>

        {/* PDF-отчет */}
        <button
          onClick={handleDownloadPdf}
          disabled={!result || pdfLoading}
          style={{
            margin: "12px 0 0 0",
            padding: "12px 24px",
            borderRadius: 10,
            border: "2px solid #e7c873",
            background: "#232526",
            color: "#e7c873",
            fontWeight: 700,
            fontSize: "1.05em",
            cursor: (!result || pdfLoading) ? "not-allowed" : "pointer",
            opacity: (!result || pdfLoading) ? 0.5 : 1,
            marginBottom: 8
          }}
        >
          {pdfLoading ? "Формируем PDF..." : "Скачать PDF-отчет"}
        </button>

        {/* Telegram */}
        <a
          href={tgLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            background: "linear-gradient(90deg, #1edc8b 0%, #e7c873 100%)",
            color: "#121212",
            fontWeight: 800,
            fontSize: "1.05em",
            textAlign: "center",
            textDecoration: "none",
            boxShadow: "0 0 20px #1edc8b55"
          }}
        >
          Обсудить мой Код Доступа в Telegram
        </a>

        <button
          onClick={onRestart}
          style={{ background: "none", border: "none", color: "#e7c873", textDecoration: "underline", fontSize: "0.9em", cursor: "pointer", opacity: 0.7 }}
        >Пройти заново</button>
      </div>
    </main>
  );
};
