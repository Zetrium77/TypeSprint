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
  const [layout, setLayout] = useState<"en" | "ru">("en");
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Сброс и подгрузка twin-текста при смене языка или id
  useEffect(() => {
    const twin = texts.find((t) => t.id === textId);
    if (!twin || !twin[language]) {
      setError(language === "en" ? "Text not found. Please select a text." : "Текст не найден. Пожалуйста, выберите текст.");
      setText("");
      return;
    }
    setText(twin[language].text);
    setLayout(detectLayout(twin[language].text));
    setError("");
    setCurrentKey("");
  }, [language, textId]);

  const handleCurrentKeyChange = (key: string) => setCurrentKey(key);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[95vh] bg-[var(--color-bg)]">
        <div className="bg-[var(--color-block)] border border-[var(--color-border)] rounded-xl shadow-lg p-8 text-center">
          <p className="text-xl text-[var(--color-error)] mb-4">{error}</p>
          <button
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200"
            onClick={() => navigate("/select")}
          >
            {language === "en" ? "Back to Text Selection" : "Назад к выбору текста"}
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
          />
        </div>
      </div>
      {/* Keyboard visualization */}
      <Keyboard currentKey={currentKey} layout={layout} />
    </div>
  );
};

export default Training;