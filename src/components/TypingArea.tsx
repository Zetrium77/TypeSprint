import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Props for TypingArea
interface TypingAreaProps {
  text: string;
  onCurrentKeyChange: (key: string) => void;
}

// Symbols for Enter visualization
const ENTER_SYMBOL = "↵";
const ENTER_KEY = "Enter";
const ENTER_CHAR = "\n"; // for userInput

/**
 * Splits text into lines by words, considering visual line width.
 * @param text - source text
 * @param maxVisualLen - max "visual" line length (pseudo-chars)
 * @returns array of lines
 */
function splitTextToLinesVisual(text: string, maxVisualLen: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  let visualLen = 0;

  // Scaling coefficients for visual line length calculation:
  // charCoef — multiplier for each character (letter)
  // spaceCoef — multiplier for space between words (mx-2)
  // betweenCharCoef — multiplier for space between letters (mx-1)
  // Adjust these values for your design if you need to change line width!
  const charCoef = 1.2; // each character (letter)
  const spaceCoef = 2.5; // space between words (mx-2)
  const betweenCharCoef = 1.2; // between letters (mx-1)

  for (const word of words) {
    // Visual word length: chars + (chars-1)*betweenCharCoef
    const wordLen = word.length * charCoef + (word.length - 1) * betweenCharCoef;
    const spaceLen = currentLine ? spaceCoef : 0;
    if (visualLen + spaceLen + wordLen > maxVisualLen) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      visualLen = wordLen;
    } else {
      currentLine += (currentLine ? " " : "") + word;
      visualLen += spaceLen + wordLen;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

const TypingArea = ({ text, onCurrentKeyChange }: TypingAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // lines — array of lines to display
  const [lines, setLines] = useState(() => splitTextToLinesVisual(text, 60));
  // Index of the current line
  const [currentLine, setCurrentLine] = useState(0);
  // User input for the current line
  const [userInput, setUserInput] = useState<string[]>([]);
  // User input for all lines (for highlighting previous lines)
  const [lineInputs, setLineInputs] = useState<string[][]>([]);

  /**
   * Recalculates line length by container width and resets progress.
   * The width/13 coefficient is chosen experimentally for your design.
   */
  const recalcLineLen = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const visualLen = Math.floor(width / 14); // coefficient is chosen for your UI
      setLines(splitTextToLinesVisual(text, visualLen));
      setCurrentLine(0);
      setUserInput([]);
      setLineInputs([]);
    }
  };

  // Recalculate lines on container resize
  useEffect(() => {
    recalcLineLen();
    window.addEventListener("resize", recalcLineLen);
    return () => window.removeEventListener("resize", recalcLineLen);
  }, [text]);

  // Focus container for input when switching lines
  useEffect(() => {
    containerRef.current?.focus();
  }, [currentLine]);

  // Get lines with Enter
  const currentText = lines[currentLine] || "";
  const currentFullText = currentText + ENTER_CHAR;

  // Notify Training which key is expected now
  useEffect(() => {
    const chars = currentText.split("");
    const fullChars = [...chars, ENTER_CHAR];
    const nextKey = fullChars[userInput.length] || "";
    onCurrentKeyChange(nextKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput, currentLine, currentText]);

  // Keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // If Enter is pressed
    if (e.key === ENTER_KEY) {
      // Play sound
      try { const audio = new Audio('/sounds/tap.mp3'); audio.volume = 0.3; audio.play(); } catch { }
      if (userInput.length === currentText.length) {
        // Enter at the right position
        const newInput = [...userInput, ENTER_CHAR];
        setUserInput(newInput);
        // Save input for the current line
        setLineInputs((prev) => {
          const updated = [...prev];
          updated[currentLine] = newInput;
          return updated;
        });
        // Go to next line or return to text selection
        setTimeout(() => {
          if (currentLine + 1 >= lines.length) {
            navigate('/select');
          } else {
            setCurrentLine((i) => i + 1);
            setUserInput(lineInputs[currentLine + 1] || []);
          }
        }, 100);
      } else {
        // If Enter is not at the right position — just highlight error and move cursor forward
        if (userInput.length < currentFullText.length) {
          const newInput = [...userInput, ENTER_CHAR];
          setUserInput(newInput);
          setLineInputs((prev) => {
            const updated = [...prev];
            updated[currentLine] = newInput;
            return updated;
          });
          // Do NOT go to next line!
        }
      }
      e.preventDefault();
      return;
    }
    // If Backspace
    if (e.key === "Backspace") {
      // Play sound
      try { const audio = new Audio('/sounds/tap.mp3'); audio.volume = 0.3; audio.play(); } catch { }
      if (userInput.length > 0) {
        setUserInput(userInput.slice(0, -1));
      } else if (currentLine > 0) {
        // If at the first position — go back to previous line
        const prevInput = lineInputs[currentLine - 1] || [];
        if (prevInput[prevInput.length - 1] === ENTER_CHAR) {
          const updatedPrev = prevInput.slice(0, -1);
          setLineInputs((prev) => {
            const updated = [...prev];
            updated[currentLine - 1] = updatedPrev;
            // Clear progress for current line if it's fully erased
            updated[currentLine] = [];
            return updated;
          });
          setCurrentLine(currentLine - 1);
          setUserInput(updatedPrev);
        } else {
          setLineInputs((prev) => {
            const updated = [...prev];
            // Clear progress for current line if it's fully erased
            updated[currentLine] = [];
            return updated;
          });
          setCurrentLine(currentLine - 1);
          setUserInput(prevInput);
        }
      }
      e.preventDefault();
      return;
    }
    // Regular character
    if (e.key.length === 1) {
      // Play sound
      try { const audio = new Audio('/sounds/tap.mp3'); audio.volume = 0.3; audio.play(); } catch { }
      if (userInput.length < currentText.length) {
        setUserInput([...userInput, e.key]);
      } else if (userInput.length === currentText.length) {
        // If cursor is at Enter, but not Enter pressed — mark as error
        setUserInput([...userInput, e.key]);
        setLineInputs((prev) => {
          const updated = [...prev];
          updated[currentLine] = [...userInput, e.key];
          return updated;
        });
        setTimeout(() => {
          if (currentLine + 1 >= lines.length) {
            navigate('/select');
          } else {
            setCurrentLine((i) => i + 1);
            setUserInput(lineInputs[currentLine + 1] || []);
          }
        }, 100);
      }
      e.preventDefault();
      return;
    }
    // For all other keys — do nothing (no sound)
  };

  // Global keydown handler
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      // Convert to React.KeyboardEvent-like
      const syntheticEvent = {
        key: e.key,
        preventDefault: () => e.preventDefault(),
      } as React.KeyboardEvent<HTMLDivElement>;
      handleKeyDown(syntheticEvent);
    };
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [currentLine, userInput, lineInputs, lines]);

  // Helper for rendering a line with highlighting and cursor
  const renderLine = (text: string, input: string[] = [], isActive = false) => {
    const chars = text.split("");
    const fullChars = [...chars, ENTER_CHAR];
    return (
      <div className="flex justify-center select-none flex-wrap">
        {fullChars.map((char, idx) => {
          const isSpace = char === " ";
          const isEnter = char === ENTER_CHAR;
          let color = "text-[var(--color-text-secondary)]";
          let underline = "";
          let content = char;
          if (isEnter) content = ENTER_SYMBOL;
          let spaceUnderline = "";
          if (isActive) {
            if (idx < input.length) {
              if (isEnter) {
                color = input[idx] === ENTER_CHAR ? "text-[var(--color-success)]" : "text-[var(--color-error)]";
              } else if (isSpace) {
                spaceUnderline = input[idx] === char ? "border-b-4 border-[var(--color-success)]" : "border-b-4 border-[var(--color-error)]";
                color = "text-transparent";
              } else {
                color = input[idx] === char ? "text-[var(--color-success)]" : "text-[var(--color-error)]";
              }
            } else if (idx === input.length) {
              underline = "border-b-4 border-[var(--color-cursor)]";
              color = isEnter ? "text-[var(--color-cursor)]" : "text-[var(--color-cursor)]";
              if (isSpace) color = "text-transparent";
            } else {
              color = "text-[var(--color-text)]";
              if (isSpace) color = "text-transparent";
            }
          } else {
            if (isSpace) color = "text-transparent";
          }
          return (
            <span
              key={idx}
              className={`font-mono ${isEnter ? "mx-2" : isSpace ? "mx-2" : "mx-1"} text-2xl md:text-4xl ${color} ${underline} ${spaceUnderline} transition-colors duration-100`}
            >
              {content === " " ? "\u00A0" : content}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="outline-none focus:ring-2 focus:ring-blue-400 bg-transparent py-5 rounded-lg"
      aria-label="Typing area"
    >
      <div className="flex flex-col gap-4 justify-center items-start">
        {/* Previous line (faded, if exists) */}
        {currentLine > 0 && (
          <div className="opacity-50">{renderLine(lines[currentLine - 1], lineInputs[currentLine - 1] || [], true)}</div>
        )}
        {/* Current line */}
        {renderLine(currentText, userInput, true)}
        {/* Next line (faded, if exists) */}
        {currentLine < lines.length - 1 && (
          <div className="opacity-50">{renderLine(lines[currentLine + 1], lineInputs[currentLine + 1] || [])}</div>
        )}
      </div>
    </div>
  );
};

export default TypingArea;