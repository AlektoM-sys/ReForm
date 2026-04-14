import { useState } from "react";
import "./App.css";
import heroImg from "./assets/my_foto.jpg";
import fonBg from "./assets/fon.png";
import { BioQuiz } from "./components/BioQuiz";
import { BioResult } from "./components/BioResult";

const MOTIVATION = [
  "Каждый шаг к себе — уже победа.",
  "Ваша уникальность — ваш главный ресурс.",
  "Внутренний баланс — основа успеха.",
  "Позвольте себе быть в ресурсе.",
  "Re-Form: пространство для роста и поддержки.",
];

export default function App() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'result'>("start");
  const [bioAnswers, setBioAnswers] = useState<Record<string, string> | null>(null);
  const [motIdx, setMotIdx] = useState(0);

  return (
    <div className="rf-root rf-dark rf-vertical" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{
        backgroundImage: `url(${fonBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      <header className="rf-section rf-section-header" style={{ background: "rgba(24,26,27,0.92)", boxShadow: "0 2px 16px #000a", borderBottom: "1px solid #232526", position: "relative", zIndex: 2 }}>
        <div className="rf-logo" style={{ fontSize: "2.5rem", color: "#e7c873", textShadow: "0 4px 24px rgba(231, 200, 115, 0.5), 0 0 32px rgba(231, 200, 115, 0.3)" }}>Re-Form</div>
      </header>

      {screen === "start" && (
        <main className="rf-section rf-section-main rf-center" style={{ maxWidth: 540, width: "100%", margin: "0 auto", padding: "48px 12px 32px 12px", position: "relative", zIndex: 2 }}>
          <div className="rf-project-desc" style={{ fontSize: "1.3em", textAlign: "center", color: "#e7c873", marginBottom: 18, wordBreak: "break-word", textShadow: "0 2px 8px #000a" }}>
            Re-Form — диагностика для поиска ментальных багов и восстановления баланса. Помогаю понять себя глубже и получить индивидуальные рекомендации.
          </div>

          {/* Glassmorphism блок эксперта */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{
              background: "rgba(255,255,255,0.10)",
              borderRadius: 18,
              boxShadow: "0 4px 32px 0 #0006, 0 1.5px 0 0 #2a2d2e",
              border: "2px solid #e7c873",
              padding: "28px 32px 28px 28px",
              display: "flex",
              alignItems: "center",
              gap: 28,
              minWidth: 0,
              maxWidth: 520,
              width: "100%",
              position: "relative",
              backdropFilter: "blur(8px)"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #e7c873 60%, #bfa14a 100%)",
                borderRadius: "50%",
                padding: 5,
                width: 140,
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 6px rgba(255,255,255,0.10)",
                marginRight: 32,
                flexShrink: 0
              }}>
                <div style={{
                  background: "#232526",
                  borderRadius: "50%",
                  padding: 4,
                  width: 130,
                  height: 130,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <img src={heroImg} alt="Эксперт" style={{ width: 122, height: 122, objectFit: "cover", borderRadius: "50%", display: "block" }} />
                </div>
              </div>
              <div className="rf-maria-info" style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ color: "#e7c873", fontWeight: 700, fontSize: "1.18em", marginBottom: 2 }}>Мария</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "1.05em", marginBottom: 6 }}>Психолог, эксперт по <span style={{ color: "#e7c873" }}>ментальному коду</span></div>
                <div style={{ color: "#fff", fontSize: "1em", lineHeight: 1.5 }}>
                  Помогаю <span style={{ color: "#e7c873", fontWeight: 500 }}>раскрыть внутренние ресурсы</span>, устранить ментальные баги и восстановить <span style={{ color: "#e7c873", fontWeight: 500 }}>баланс</span> между психикой и телом. 10+ лет практики.
                </div>
              </div>
            </div>
          </div>

          <div className="rf-project-mission">Миссия: поддержка, раскрытие потенциала, восстановление баланса.</div>
          <div className="rf-project-about">Проект создан для поддержки людей на пути к внутренней гармонии и ресурсности.</div>

          <div className="rf-intro-text" style={{ color: "#bfa14a", margin: "24px 0 32px 0", fontStyle: "italic" }}>
            Узнай, где твой ментальный 'баг' блокирует твою клеточную энергию.
          </div>

          <div style={{ display: "flex", gap: 24, marginBottom: 32, alignItems: "center", justifyContent: "center", flexWrap: "nowrap", width: "100%", maxWidth: 400 }}>
            <div style={{ background: "linear-gradient(135deg, #232526 80%, rgba(231, 200, 115, 0.2) 100%)", border: "2px solid #e7c873", borderRadius: 12, padding: "16px 24px", color: "#e7c873", fontWeight: 600, textAlign: "center", minWidth: 140, flex: 1 }}>
              МЕНТАЛЬНЫЙ<br />КОД
            </div>
            <div style={{ fontSize: "2em", color: "#e7c873", opacity: 0.7, flex: "none" }}>⚡</div>
            <div style={{ background: "linear-gradient(135deg, #232526 80%, rgba(30, 220, 139, 0.2) 100%)", border: "2px solid #1edc8b", borderRadius: 12, padding: "16px 24px", color: "#1edc8b", fontWeight: 600, textAlign: "center", minWidth: 140, flex: 1 }}>
              КЛЕТОЧНЫЙ<br />РЕСУРС
            </div>
          </div>

          <button
            className="rf-btn rf-emerald rf-start-btn neon-glow"
            style={{ fontSize: "1.2em", padding: "16px 32px", borderRadius: 12, marginBottom: 32, width: "100%", maxWidth: 400, boxShadow: "0 0 24px 6px #1edc8b99, 0 2px 16px #e7c87399" }}
            onClick={() => setScreen("quiz")}
          >
            Начать сканирование системы
          </button>

          <div style={{ color: "#e7c873", fontStyle: "italic", textAlign: "center", fontSize: "1em", marginBottom: 16, opacity: 0.8 }}>
            "Твои трещины — это каналы для твоего нового света."
          </div>

          <div className="rf-motivation-phrase" style={{ marginTop: 16, color: "#e7c873", textAlign: "center", fontStyle: "italic" }}>{MOTIVATION[motIdx]}</div>
          <div className="rf-motivation-controls" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <button className="rf-mot-btn" onClick={() => setMotIdx((motIdx - 1 + MOTIVATION.length) % MOTIVATION.length)}>&lt;</button>
            <button className="rf-mot-btn" onClick={() => setMotIdx((motIdx + 1) % MOTIVATION.length)}>&gt;</button>
          </div>
        </main>
      )}

      {screen === "quiz" && !bioAnswers && (
        <BioQuiz
          onFinish={answers => {
            setBioAnswers(answers);
            setScreen("result");
          }}
        />
      )}

      {screen === "result" && bioAnswers && (
        <BioResult
          answers={bioAnswers}
          onRestart={() => {
            setBioAnswers(null);
            setScreen("quiz");
          }}
        />
      )}

      <footer className="rf-section rf-section-footer rf-footer-premium" style={{ background: "rgba(24,26,27,0.92)", borderTop: "2px solid #232526", padding: "24px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 2 }}>
        <div className="rf-footer-logo" style={{ fontSize: "1.8em", fontWeight: 900, color: "#e7c873", textShadow: "0 2px 8px #e7c87355" }}>Re-Form</div>
        <div className="rf-footer-socials" style={{ display: "flex", gap: 16 }}>
          <a href="https://t.me/MariaPsyRes" target="_blank" rel="noopener" aria-label="Telegram" style={{ width: 48, height: 48, borderRadius: "50%", background: "#232526", border: "2px solid #e7c873", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 8px #e7c87355", textDecoration: "none" }}>
            <span style={{ color: "#e7c873", fontSize: "1.5em" }}>✈️</span>
          </a>
          <a href="https://instagram.com/mariaresurskletki" target="_blank" rel="noopener" aria-label="Instagram" style={{ width: 48, height: 48, borderRadius: "50%", background: "#232526", border: "2px solid #e7c873", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 8px #e7c87355", textDecoration: "none" }}>
            <span style={{ color: "#e7c873", fontSize: "1.5em" }}>📸</span>
          </a>
          <a href="mailto:iipsyhelp12@gmail.com" aria-label="Email" style={{ width: 48, height: 48, borderRadius: "50%", background: "#232526", border: "2px solid #e7c873", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 8px #e7c87355", textDecoration: "none" }}>
            <span style={{ color: "#e7c873", fontSize: "1.5em" }}>✉️</span>
          </a>
        </div>
        <div>© 2026 Re-Form. Все права защищены.</div>
        <div>Сайт не является медицинским сервисом. Для связи: <a href="mailto:iipsyhelp12@gmail.com" style={{ color: "#e7c873" }}>iipsyhelp12@gmail.com</a></div>
      </footer>
    </div>
  );
}
