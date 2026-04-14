import React, { useState, useEffect, useRef } from "react";
import { allQuestions } from "../quizData";

interface BioQuizProps {
  onFinish: (answers: Record<string, string>) => void;
}

export const BioQuiz: React.FC<BioQuizProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q = allQuestions[step];
  const progress = ((step + 1) / allQuestions.length) * 100;
  const qAny = q as { key: string; text: string; type?: string; min?: number; max?: number; hasTimer?: boolean; options?: string[]; hint?: string };
  const isNumber = qAny.type === "number";
  const min = qAny.min;
  const max = qAny.max;
  const hasTimer = !!qAny.hasTimer;
  const options = qAny.options;
  const canNext = isNumber
    ? !!(answers[q.key] && +answers[q.key] >= (min ?? 0) && +answers[q.key] <= (max ?? 999))
    : !!answers[q.key];

  // Timer (for hasTimer questions)
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimerSecs(0);
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [step]);

  function startTimer() {
    setTimerSecs(0);
    setTimerRunning(true);
    intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000);
  }

  function stopTimer() {
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function handleNext() {
    if (step < allQuestions.length - 1) setStep(step + 1);
    else onFinish(answers);
  }

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
        {/* Прогресс-бар */}
        <div style={{ width: "100%", height: 6, background: "#1a2a1a", borderRadius: 99, marginBottom: 8 }}>
          <div style={{ height: 6, background: "#1edc8b", borderRadius: 99, width: `${progress}%`, transition: "width 0.4s" }} />
        </div>

        <div style={{ color: "#1edc8b", fontSize: "0.85em", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          {step + 1} / {allQuestions.length}
        </div>

        <div style={{ color: "#f5e9c6", fontSize: "1.2em", fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
          {q.text}
        </div>

        {q.hint && (
          <div style={{
            background: "rgba(231,200,115,0.08)",
            border: "1px solid rgba(231,200,115,0.25)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#bfa14a",
            fontSize: "0.85em",
            lineHeight: 1.55,
            textAlign: "center",
            width: "100%"
          }}>
            💡 {q.hint}
          </div>
        )}

        {/* Таймер для hasTimer-вопросов */}
        {hasTimer && (
          <div style={{
            background: "rgba(30,220,139,0.07)",
            border: "1px solid rgba(30,220,139,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            width: "100%",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "3em", fontWeight: 900, color: "#1edc8b", lineHeight: 1, letterSpacing: 2 }}>
              {timerSecs}<span style={{ fontSize: "0.45em", fontWeight: 600, marginLeft: 4 }}>сек</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {!timerRunning && timerSecs === 0 && (
                <button onClick={startTimer} style={{
                  padding: "8px 24px", borderRadius: 8, border: "none",
                  background: "#1edc8b", color: "#121212", fontWeight: 700, cursor: "pointer", fontSize: "0.97em"
                }}>▶ Старт</button>
              )}
              {timerRunning && (
                <button onClick={stopTimer} style={{
                  padding: "8px 24px", borderRadius: 8, border: "none",
                  background: "#e7c873", color: "#121212", fontWeight: 700, cursor: "pointer", fontSize: "0.97em"
                }}>⏹ Стоп</button>
              )}
              {!timerRunning && timerSecs > 0 && (
                <>
                  <div style={{ color: "#f5e9c6", fontSize: "0.9em", alignSelf: "center" }}>Ваш результат: <strong style={{ color: "#1edc8b" }}>{timerSecs} сек</strong></div>
                  <button onClick={startTimer} style={{
                    padding: "8px 18px", borderRadius: 8, border: "2px solid #1edc8b",
                    background: "transparent", color: "#1edc8b", fontWeight: 600, cursor: "pointer", fontSize: "0.88em"
                  }}>↺ Повторить</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Ввод числа */}
        {isNumber ? (
          <>
            <input
              type="text"
              inputMode="numeric"
              value={answers[q.key] || ""}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setAnswers(a => ({ ...a, [q.key]: val }));
              }}
              placeholder="—"
              style={{
                width: 120,
                textAlign: "center",
                fontSize: "2em",
                fontWeight: 700,
                padding: "10px 16px",
                borderRadius: 12,
                border: "2px solid #e7c873",
                background: "rgba(0,0,0,0.6)",
                color: "#e7c873",
                outline: "none",
              }}
            />
            {typeof min === "number" && typeof max === "number" && (
              <div style={{ color: "#bfa14a", fontSize: "0.85em", marginTop: 4 }}>
                от {min} до {max} лет
              </div>
            )}
          </>
        ) : (
          /* Варианты ответа */
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {(options ?? []).map((opt: string) => (
              <button
                key={opt}
                onClick={() => setAnswers(a => ({ ...a, [q.key]: opt }))}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: answers[q.key] === opt ? "2px solid #e7c873" : "2px solid rgba(231,200,115,0.3)",
                  background: answers[q.key] === opt ? "#e7c873" : "rgba(0,0,0,0.4)",
                  color: answers[q.key] === opt ? "#121212" : "#f5e9c6",
                  fontWeight: 600,
                  fontSize: "0.97em",
                  cursor: "pointer",
                  transition: "all 0.18s"
                }}
              >{opt}</button>
            ))}
          </div>
        )}

        {/* Навигация */}
        <div style={{ display: "flex", gap: 16, marginTop: 8, width: "100%", justifyContent: "space-between" }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              padding: "10px 28px",
              borderRadius: 10,
              border: "2px solid #1edc8b",
              background: "transparent",
              color: "#1edc8b",
              fontWeight: 700,
              fontSize: "1em",
              cursor: step === 0 ? "not-allowed" : "pointer",
              opacity: step === 0 ? 0.4 : 1
            }}
          >Назад</button>
          <button
            onClick={handleNext}
            disabled={!canNext}
            style={{
              padding: "10px 28px",
              borderRadius: 10,
              border: "none",
              background: canNext ? "#e7c873" : "rgba(231,200,115,0.3)",
              color: canNext ? "#121212" : "#888",
              fontWeight: 700,
              fontSize: "1em",
              cursor: canNext ? "pointer" : "not-allowed",
              boxShadow: canNext ? "0 0 16px #e7c87366" : "none",
              transition: "all 0.18s"
            }}
          >{step === allQuestions.length - 1 ? "Завершить" : "Далее"}</button>
        </div>
      </div>
    </main>
  );
};
