import React from "react";

interface AICoachResultProps {
  result: any;
}

export const AICoachResult: React.FC<AICoachResultProps> = ({ result }) => (
  <div className="bg-[#232526]/60 rounded-2xl p-6 text-[#f5e9c6] font-medium shadow-lg">
    <div className="mb-2">Ваша дельта: <b>{result.bioAge - result.passportAge > 0 ? `+${result.bioAge - result.passportAge}` : result.bioAge - result.passportAge} лет</b></div>
    <div className="mb-2"><b>Диагноз:</b> {result.ai.diagnosis}</div>
    <div className="mb-2"><b>Влияние ментальных багов и микробиома:</b> {result.ai.mental}</div>
    <div className="mb-2"><b>Рекомендации:</b>
      <ul className="list-disc ml-6">
        {result.ai.recommendations.map((rec: string, i: number) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
    </div>
    <div
      className="mt-6 mb-2 flex items-center justify-center"
      style={{
        background: "linear-gradient(90deg, #232526 80%, #e7c87322 100%)",
        border: "2px solid #e7c873",
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 2px 16px #e7c87333, 0 1.5px 0 0 #2a2d2e",
        maxWidth: 520,
        margin: "0 auto"
      }}
    >
      <span style={{ fontSize: 22, color: "#e7c873", marginRight: 14, filter: "drop-shadow(0 0 2px #e7c87399)" }}>📊</span>
      <span style={{ color: "#e7c873", fontWeight: 600, fontSize: "1.08em", fontFamily: 'Montserrat, Inter, Arial, sans-serif', letterSpacing: 0.01 }}>
        Расчет произведен на основе мета-анализа данных NHANES.<br />
        <span style={{ color: "#f5e9c6", fontWeight: 400, fontSize: "0.98em", fontStyle: "italic" }}>
          Данная оценка является прогностической и коррелирует с функциональным состоянием систем организма.
        </span>
      </span>
    </div>
    {result.ai.ambassador && (
      <div className="mt-4 text-[#e7c873] font-bold" dangerouslySetInnerHTML={{ __html: result.ai.ambassador }} />
    )}
  </div>
);
