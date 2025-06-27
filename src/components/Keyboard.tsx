import { useMemo } from "react";

// Props type
interface KeyboardProps {
  currentKey?: string; // key to highlight
  layout?: "en" | "ru";
}

// Keyboard layouts
const layouts = {
  en: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Space"]
  ],
  ru: [
    ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\"],
    ["CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter"],
    ["Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "Shift"],
    ["Space"]
  ]
};

// For determining keyboard side
const leftKeys = {
  ru: new Set(["й","ц","у","к","е","ф","ы","в","а","п","я","ч","с","м","и","ё","1","2","3","4","5","6"]),
  en: new Set(["q","w","e","r","t","a","s","d","f","g","z","x","c","v","b","`","1","2","3","4","5","6"])
};
const rightKeys = {
  ru: new Set(["н","г","ш","щ","з","х","ъ","р","о","л","д","ж","э","т","ь","б","ю",".","7","8","9","0","-","="]),
  en: new Set(["y","u","i","o","p","h","j","k","l","n","m",",",".","/","7","8","9","0","-","="])
};

// Check if Shift highlight is needed for the current letter
function needsShift(key: string) {
  // Latin: A-Z, Cyrillic: А-Я, Ё
  return /^[A-ZА-ЯЁ]$/.test(key);
}

// Determine which Shift to highlight ("left" | "right" | null)
function getShiftSide(currentKey: string, layout: "en" | "ru"): "left" | "right" | null {
  if (!needsShift(currentKey)) return null;
  const lower = currentKey.toLowerCase();
  if (leftKeys[layout].has(lower)) return "right";
  if (rightKeys[layout].has(lower)) return "left";
  // If not found — by default both (or pick one)
  return null;
}

const Keyboard = ({ currentKey = "", layout = "ru" }: KeyboardProps) => {
  // Determine active layout by prop
  const activeLayout = useMemo(() => (layout === "en" ? "en" : "ru"), [layout]);

  // Which Shift side to highlight
  const shiftSide = getShiftSide(currentKey, activeLayout);

  // Function to highlight the needed key
  const isActive = (key: string, keyIdx: number, row: string[]) => {
    if (!currentKey) return false;
    // For space
    if (key === "Space" && currentKey === " ") return true;
    // For Shift: highlight only the needed one
    if (key === "Shift") {
      if (shiftSide === "left" && keyIdx === 0) return true;
      if (shiftSide === "right" && keyIdx === row.length - 1) return true;
      return false;
    }
    // Compare case-insensitive
    return key.toLowerCase() === currentKey.toLowerCase();
  };

  return (
    <div className="flex flex-col items-center w-full bg-[var(--color-bg)] pb-8">
      <div className="bg-[var(--color-block)] dark:bg-[var(--color-block)] rounded-3xl shadow-inner p-4 w-full max-w-3xl flex flex-col gap-2 border border-[var(--color-border)]">
        {layouts[activeLayout].map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((key, keyIdx) => {
              const isSpecial = ["Backspace", "Tab", "CapsLock", "Enter", "Shift", "Space"].includes(key);
              const baseStyle =
                "font-mono text-lg md:text-xl flex items-center justify-center select-none transition-colors duration-100";
              const activeStyle = isActive(key, keyIdx, row)
                ? "bg-[var(--color-accent)] text-white shadow-lg"
                : "bg-white dark:bg-[var(--color-block)] text-[var(--color-text)] dark:text-[var(--color-text)]";
              const specialStyle = isSpecial
                ? "font-semibold px-4 py-2 rounded-lg min-w-[60px]"
                : "px-3 py-2 rounded";
              // Space: fixed width, increased height, centered
              const spaceStyle = key === "Space" ? "w-1/3 max-w-xs mx-auto h-10" : "";
              return (
                <span
                  key={keyIdx}
                  className={[
                    baseStyle,
                    activeStyle,
                    specialStyle,
                    spaceStyle,
                    "border border-[var(--color-border)]"
                  ].join(" ")}
                >
                  {key === "Space" ? "" : key}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
