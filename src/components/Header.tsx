import ThemeSwitch from "./ThemeSwitch";
import { Link } from "react-router-dom";
import { useLanguage } from "../theme/LanguageProvider";

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const home = language === "en" ? "Home" : "Главная";
  const stats = language === "en" ? "Stats" : "Статистика";
  const login = language === "en" ? "Login" : "Войти";

  return (
    <div className="bg-[var(--color-block)] text-[var(--color-text)] border-b border-[var(--color-border)] flex flex-row justify-center h-[5vh] items-center shadow-md px-6">
      <div className="w-3/4 flex flex-row justify-between items-center mx-auto">
        <div className="flex flex-row gap-6 items-center text-xl">
          <Link
            to="/"
            className="logo-type-sprint font-mono font-extrabold text-3xl tracking-widest text-[var(--color-accent)] dark:text-[var(--color-accent)] px-0 py-0 select-none shadow-none border-none bg-transparent focus:outline-none focus:ring-0"
            style={{ letterSpacing: ".12em", textShadow: "0 1px 8px rgba(37,99,235,0.08)" }}
            tabIndex={0}
            aria-label="Type Sprint logo"
          >
            Type Sprint
          </Link>
          <Link
            to="/"
            className="text-[var(--color-text)] dark:text-[var(--color-text)] hover:text-[var(--color-accent)] px-2 py-1 rounded transition-colors duration-200"
          >
            {home}
          </Link>
          <Link
            to="/statistics"
            className="text-[var(--color-text)] dark:text-[var(--color-text)] hover:text-[var(--color-accent)] px-2 py-1 rounded transition-colors duration-200"
          >
            {stats}
          </Link>

        </div>
        <div className="flex flex-row gap-2 text-base items-center min-w-0">
          <div className="flex gap-0.5 items-center bg-[var(--color-bg)] rounded px-1 py-0.5 border border-[var(--color-border)] min-w-0">
            <button
              className={`px-1.5 py-0.5 rounded font-bold text-sm transition-colors duration-150 ${language === "en" ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-block)]"}`}
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              style={{ minWidth: 32 }}
            >
              EN
            </button>
            <button
              className={`px-1.5 py-0.5 rounded font-bold text-sm transition-colors duration-150 ${language === "ru" ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-block)]"}`}
              onClick={() => setLanguage("ru")}
              aria-pressed={language === "ru"}
              style={{ minWidth: 32 }}
            >
              RU
            </button>

          </div>
          <div className="scale-80">
            <ThemeSwitch />
          </div>
          <Link
            to="/login"
            className="text-[var(--color-text)] dark:text-[var(--color-text)] hover:text-[var(--color-accent)] px-2 py-1 rounded transition-colors duration-200"
          >
            {login}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
