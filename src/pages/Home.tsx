import { Link } from "react-router-dom";
import { useLanguage } from "../theme/LanguageProvider";

const Home = () => {
  const { language } = useLanguage();
  const title = language === "en"
    ? "Touch Typing Trainer"
    : language === "ru"
    ? "Тренажёр слепой печати"
    : "Trener pisania bezwzrokowego";
  const description = language === "en"
    ? "Improve your typing speed and accuracy without looking at the keyboard. Start training and track your progress!"
    : language === "ru"
    ? "Улучшайте скорость и точность печати, не глядя на клавиатуру. Начните тренировку и отслеживайте свой прогресс!"
    : "Popraw swoją prędkość i dokładność pisania bez patrzenia na klawiaturę. Rozpocznij trening i śledź swój postęp!";
  const button = language === "en" ? "Start Training" : language === "ru" ? "Начать тренировку" : "Rozpocznij trening";

  return (
    <div className="bg-[var(--color-bg)] flex flex-col items-center justify-center min-h-[95vh] gap-8 text-center">
      <div>
        <h1 className="text-5xl font-bold mb-4 text-[var(--color-text)]">{title}</h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto">
          {description}
        </p>
      </div>
      <Link
        to="/select"
        className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-2xl font-semibold py-4 px-10 rounded-lg shadow-lg transition-colors duration-200"
      >
        {button}
      </Link>
    </div>
  );
};

export default Home;
