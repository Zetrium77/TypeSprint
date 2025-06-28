import { useState, useEffect } from "react";
import TypingArea from "../components/TypingArea";
import Keyboard from "../components/Keyboard";
import { detectLayout } from "../utils/detectLayout";
import texts from "../texts/texts.json";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../theme/LanguageProvider";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Training = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const textId = query.get("textId");
  const [currentKey, setCurrentKey] = useState<string>("");
  const [layout, setLayout] = useState<"en" | "ru" | "pl">("en");
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Reset and load twin-text when language or id changes
  useEffect(() => {
    const twin = texts.find((t) => t.id === textId);
    if (!twin || !twin[language]) {
      const errorMessage = language === "en" 
        ? "Text not found. Please select a text." 
        : language === "ru"
        ? "Текст не найден. Пожалуйста, выберите текст."
        : "Tekst nie został znaleziony. Proszę wybierz tekst.";
      setError(errorMessage);
      setText("");
      return;
    }
    setText(twin[language].text);
    setLayout(detectLayout(twin[language].text));
    setError("");
    setCurrentKey("");
  }, [language, textId]);

  const handleCurrentKeyChange = (key: string) => setCurrentKey(key);

  // function for saving statistics
  const handleFinish = (result: { wpm: number; accuracy: number }) => {
    if (!textId) return;
    // Save to localStorage
    const statsRaw = localStorage.getItem("typing_stats");
    let stats: any[] = [];
    try { if (statsRaw) stats = JSON.parse(statsRaw); } catch {}
    stats.push({
      id: textId,
      language,
      wpm: result.wpm,
      accuracy: result.accuracy,
      date: new Date().toISOString(),
    });
    localStorage.setItem("typing_stats", JSON.stringify(stats));
    // Go to the results (or statistics) page
    navigate("/statistics");
  };

  if (error) {
    const backButtonText = language === "en" 
      ? "Back to Text Selection" 
      : language === "ru"
      ? "Назад к выбору текста"
      : "Powrót do wyboru tekstu";
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[95vh] bg-[var(--color-bg)]">
        <div className="bg-[var(--color-block)] border border-[var(--color-border)] rounded-xl shadow-lg p-8 text-center">
          <p className="text-xl text-[var(--color-error)] mb-4">{error}</p>
          <button
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200"
            onClick={() => navigate("/select")}
          >
            {backButtonText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[95vh] bg-[var(--color-bg)]">
      {/* Text for typing */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-3/4 text-3xl leading-relaxed text-center space-y-2 bg-[var(--color-block)] rounded-2xl shadow-lg border border-[var(--color-border)] p-6">
          <TypingArea
            text={text}
            onCurrentKeyChange={handleCurrentKeyChange}
            onFinish={handleFinish}
          />
        </div>
      </div>
      {/* Keyboard visualization */}
      <Keyboard currentKey={currentKey} layout={layout} />
    </div>
  );
};

export default Training;