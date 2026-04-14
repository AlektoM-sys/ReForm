import React from "react";

interface QuizProps {
  step: number;
  questions: any[];
  answers: string[];
  setAnswers: (a: string[]) => void;
  setStep: (s: number) => void;
  handleSubmit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ step, questions, answers, setAnswers, setStep, handleSubmit }) => {
  return (
    <main className="rf-section rf-section-main rf-center" style={{ position: "relative", zIndex: 2, maxWidth: 540, width: "100%", margin: "0 auto", padding: "48px 12px 32px 12px" }}>
      <div className="rf-progress-bar" style={{ marginBottom: 24 }}>
        <div style={{ width: `${(step / questions.length) * 100}%` }} />
      </div>
      <div className="rf-q-block">
        <div className="rf-q-cat">{questions[step - 1].block === "ИНП" ? "Психика" : questions[step - 1].block === "bio" ? "Биомаркеры" : questions[step - 1].block === "protect" ? "Защитные факторы" : questions[step - 1].block === "social" ? "Социальные маркеры" : ""}</div>
        <div className="rf-q-text">{questions[step - 1].text}</div>
        <div className="rf-q-options">
          {questions[step - 1].block === "base" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <style>{`
                .rf-age-input::-webkit-outer-spin-button,
                .rf-age-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .rf-age-input[type=number] { -moz-appearance: textfield; }
              `}</style>
              <input
                type="number"
                min={18}
                max={100}
                value={answers[step - 1] || ""}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
                  if (val !== "" && +val > 100) return;
                  const next = [...answers];
                  next[step - 1] = val;
                  setAnswers(next);
                }}
                placeholder="Введите возраст"
                className="rf-age-input"
                style={{
                  fontSize: 32,
                  padding: "16px 32px",
                  borderRadius: 14,
                  border: "2px solid #e7c873",
                  background: "#181a1b",
                  color: "#e7c873",
                  width: 180,
                  textAlign: "center",
                  outline: "none",
                  marginBottom: 8,
                  letterSpacing: 4,
                  boxShadow: "0 0 16px #e7c87344"
                }}
              />
              <div style={{ color: "#bfa14a", fontSize: 13 }}>Возраст не хранится и не передаётся третьим лицам</div>
            </div>
          ) : (
            questions[step - 1].options.map((opt: string) => (
              <label key={opt} className={`rf-q-card${answers[step - 1] === opt ? " selected" : ""}`}>
                <input
                  type="radio"
                  name={`q${step}`}
                  value={opt}
                  checked={answers[step - 1] === opt}
                  onChange={() => {
                    const next = [...answers];
                    next[step - 1] = opt;
                    setAnswers(next);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))
          )}
        </div>
      </div>
      <div className="rf-carousel-controls">
        <button className="rf-btn rf-emerald" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          Назад
        </button>
        {step < questions.length ? (
          <button
            className="rf-btn rf-gold"
            onClick={() => {
              if (questions[step - 1].block === "base") {
                if (answers[step - 1] && +answers[step - 1] >= 18 && +answers[step - 1] <= 100) setStep(step + 1);
              } else {
                if (answers[step - 1]) setStep(step + 1);
              }
            }}
            disabled={questions[step - 1].block === "base"
              ? !answers[step - 1] || +answers[step - 1] < 18 || +answers[step - 1] > 100
              : !answers[step - 1]}
          >
            Далее
          </button>
        ) : (
          <button
            className="rf-btn rf-gold"
            onClick={handleSubmit}
            disabled={questions[step - 1].block === "base"
              ? !answers[step - 1] || +answers[step - 1] < 18 || +answers[step - 1] > 100
              : !answers[step - 1]}
          >
            Завершить
          </button>
        )}
      </div>
      <div className="rf-carousel-progress-text">Вопрос {step} из {questions.length}</div>
    </main>
  );
};
