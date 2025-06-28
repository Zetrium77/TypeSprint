import { useMemo } from "react";

// Props type
interface KeyboardProps {
  currentKey?: string; // key to highlight
  layout?: "en" | "ru" | "pl";
}

// Keyboard layouts
const layouts = {
  en: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Ctrl", "Option", "Alt", "Space", "Alt", "Ctrl", ""]
  ],
  ru: [
    ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\"],
    ["CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter"],
    ["Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "Shift"],
    ["Ctrl", "Option", "Alt", "Space", "Alt", "Ctrl", ""]
  ],
  pl: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Ctrl", "Option", "Alt", "Space", "Alt", "Ctrl", ""]
  ]
};

// For determining keyboard side
const leftKeys = {
  ru: new Set(["й","ц","у","к","е","ф","ы","в","а","п","я","ч","с","м","и","ё","1","2","3","4","5","6"]),
  en: new Set(["q","w","e","r","t","a","s","d","f","g","z","x","c","v","b","`","1","2","3","4","5","6"]),
  pl: new Set(["q","w","e","r","t","a","s","d","f","g","z","x","c","v","b","`","1","2","3","4","5","6"])
};
const rightKeys = {
  ru: new Set(["н","г","ш","щ","з","х","ъ","р","о","л","д","ж","э","т","ь","б","ю",".","7","8","9","0","-","="]),
  en: new Set(["y","u","i","o","p","h","j","k","l","n","m",",",".","/","7","8","9","0","-","="]),
  pl: new Set(["y","u","i","o","p","h","j","k","l","n","m",",",".","/","7","8","9","0","-","="])
};

// Check if Shift highlight is needed for the current letter
function needsShift(key: string) {
  // Latin: A-Z, Cyrillic: А-Я, Ё, Polish: ĄĆĘŁŃÓŚŹŻ
  return /^[A-ZА-ЯЁĄĆĘŁŃÓŚŹŻ]$/.test(key);
}

// Check if Alt highlight is needed for Polish characters
function needsAlt(key: string) {
  // Polish characters that require Alt key: ą, ć, ę, ł, ń, ó, ś, ź, ż
  return /^[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]$/.test(key);
}

// Determine which Shift to highlight ("left" | "right" | null)
function getShiftSide(currentKey: string, layout: "en" | "ru" | "pl"): "left" | "right" | null {
  if (!needsShift(currentKey)) return null;
  const lower = currentKey.toLowerCase();
  if (leftKeys[layout].has(lower)) return "right";
  if (rightKeys[layout].has(lower)) return "left";
  // If not found — by default both (or pick one)
  return null;
}

const Keyboard = ({ currentKey = "", layout = "ru" }: KeyboardProps) => {
  // Determine active layout by prop
  const activeLayout = useMemo(() => {
    if (layout === "en") return "en";
    if (layout === "pl") return "pl";
    return "ru";
  }, [layout]);

  // Which Shift side to highlight
  const shiftSide = getShiftSide(currentKey, activeLayout);
  
  // Check if Alt should be highlighted for Polish characters
  const needsAltKey = needsAlt(currentKey);

  // Function to highlight the needed key
  const isActive = (key: string, keyIdx: number, row: string[]) => {
    if (!currentKey) return false;
    // For space
    if (key === "Space" && currentKey === " ") return true;
    // For Alt: highlight only the right Alt for Polish characters
    if (key === "Alt" && needsAltKey) {
      // Check if this is the right Alt (second Alt in the row)
      const currentAltIndex = row.slice(0, keyIdx + 1).filter(k => k === "Alt").length - 1;
      return currentAltIndex === 1; // Second Alt (right Alt)
    }
    // For Shift: highlight only the needed one
    if (key === "Shift") {
      if (shiftSide === "left" && keyIdx === 0) return true;
      if (shiftSide === "right" && keyIdx === row.length - 1) return true;
      return false;
    }
    // For Polish characters: highlight the base letter (without diacritics)
    if (needsAltKey) {
      const baseLetter = currentKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (key.toLowerCase() === baseLetter) return true;
    }
    // Compare case-insensitive for regular characters
    return key.toLowerCase() === currentKey.toLowerCase();
  };

  return (
    <div className="flex flex-col items-center w-full bg-[var(--color-bg)] pb-8">
      <div className="bg-[var(--color-block)] dark:bg-[var(--color-block)] rounded-3xl shadow-inner p-6 w-full max-w-4xl flex flex-col gap-3 border border-[var(--color-border)]">
        {layouts[activeLayout].map((row, i) => (
          <div key={i} className="flex justify-between gap-2">
            {row.map((key, keyIdx) => {
              const isSpecial = ["Backspace", "Tab", "CapsLock", "Enter", "Shift", "Space", "Ctrl", "Option", "Alt"].includes(key);
              
              // Base styles for all keys
              const baseStyle = "font-mono text-sm md:text-base flex items-center justify-center select-none transition-colors duration-100 font-medium";
              
              // Active state styling
              const activeStyle = isActive(key, keyIdx, row)
                ? "bg-[var(--color-accent)] text-white shadow-lg scale-105"
                : "bg-white dark:bg-[var(--color-block)] text-[var(--color-text)] dark:text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-gray-700";
              
              // Special key sizing and styling - with flex-grow for stretching
              let specialStyle = "";
              let keyWidth = "w-12 h-12 flex-shrink-0"; // Fixed size for letters and numbers
              
              if (key === "Space") {
                keyWidth = "flex-[3.5] h-12"; // Space bar 3x wider than other keys
                specialStyle = "font-semibold";
              } else if (key === "Backspace") {
                keyWidth = "flex-1 h-12"; // Flexible backspace
                specialStyle = "font-semibold text-xs";
              } else if (key === "Tab") {
                keyWidth = "flex-1 h-12"; // Flexible tab
                specialStyle = "font-semibold text-xs";
              } else if (key === "CapsLock") {
                keyWidth = "flex-1 h-12"; // Flexible caps lock
                specialStyle = "font-semibold text-xs";
              } else if (key === "Enter") {
                keyWidth = "flex-1 h-12"; // Flexible enter
                specialStyle = "font-semibold text-xs";
              } else if (key === "Shift") {
                keyWidth = "flex-1 h-12"; // Flexible shift
                specialStyle = "font-semibold text-xs";
              } else if (key === "Ctrl" || key === "Option" || key === "Alt") {
                keyWidth = "flex-1 h-12"; // Flexible modifier keys
                specialStyle = "font-semibold text-xs";
              } else if (key === "") {
                keyWidth = "flex-[1.7] h-12"; // Flexible empty placeholder
                specialStyle = "font-semibold text-xs opacity-30"; // Semi-transparent but visible
              } else {
                // Regular letter and number keys - fixed size
                keyWidth = "w-12 h-12 flex-shrink-0";
                specialStyle = "font-medium";
              }

              return (
                <span
                  key={keyIdx}
                  className={[
                    baseStyle,
                    activeStyle,
                    specialStyle,
                    keyWidth,
                    "rounded-lg border border-[var(--color-border)] shadow-sm"
                  ].join(" ")}
                >
                  {key === "Space" ? "Space" : 
                   isSpecial ? key : 
                   key.toUpperCase()}
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
