import { useEffect, useState } from "react";
import { useLanguage } from "../theme/LanguageProvider";
import texts from "../texts/texts.json";

interface StatRecord {
  id: string; // text id
  language: "en" | "ru";
  wpm: number;
  accuracy: number;
  date: string; // ISO
}

const getTextTitle = (id: string, language: "en" | "ru") => {
  const t = texts.find((t) => t.id === id);
  return t ? t[language].title : id;
};

const Stats = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<StatRecord[]>([]);

  useEffect(() => {
    // Get stats from localStorage
    const raw = localStorage.getItem("typing_stats");
    if (raw) {
      try {
        setStats(JSON.parse(raw));
      } catch {
        setStats([]);
      }
    }
  }, []);

  const title = language === "en" ? "Your Typing Statistics" : "Ваша статистика печати";
  const noStats = language === "en"
    ? "No statistics yet. Complete a training to see your results!"
    : "Статистика пока пуста. Пройдите тренировку, чтобы увидеть результаты!";
  const columns = language === "en"
    ? ["Date", "Language", "Text", "WPM", "Accuracy"]
    : ["Дата", "Язык", "Текст", "WPM", "Точность"];

  return (
    <div className="min-h-[95vh] bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-text)]">{title}</h1>
      {stats.length === 0 ? (
        <div className="text-xl text-[var(--color-text-secondary)]">{noStats}</div>
      ) : (
        <div className="w-full max-w-3xl bg-[var(--color-block)] rounded-xl shadow-lg border border-[var(--color-border)] p-6">
          <table className="w-full text-lg text-left">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="pb-2 text-[var(--color-text-secondary)] font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.slice().reverse().map((rec, i) => (
                <tr key={i} className="border-t border-[var(--color-border)]">
                  <td className="py-2 pr-2">{new Date(rec.date).toLocaleString(language === "en" ? "en-US" : "ru-RU", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="py-2 pr-2">{rec.language === "en" ? "EN" : "RU"}</td>
                  <td className="py-2 pr-2">{getTextTitle(rec.id, rec.language)}</td>
                  <td className="py-2 pr-2 font-mono">{rec.wpm}</td>
                  <td className="py-2 pr-2 font-mono">{rec.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stats;