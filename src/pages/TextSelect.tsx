import Card from "../components/Card";
import texts from "../texts/texts.json";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../theme/LanguageProvider";

const TextSelect = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const title = language === "en" 
    ? "Select a text for training" 
    : language === "ru" 
    ? "Выберите текст для тренировки"
    : "Wybierz tekst do treningu";

  const handleSelect = (id: string) => {
    navigate(`/training?textId=${id}`);
  };

  return (
    <div className="min-h-[95vh] bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-text)]">{title}</h1>
      <div className="w-3/4 flex flex-row gap-6 flex-wrap justify-center mx-auto">
        {texts.map((t) => (
          <Card
            key={t.id}
            id={t.id}
            title={t[language].title}
            text={t[language].text}
            onClick={() => handleSelect(t.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TextSelect;
