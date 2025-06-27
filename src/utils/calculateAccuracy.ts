/**
 * Calculates typing accuracy based on user input and reference text
 * @param lineInputs - Array of user input arrays for each line
 * @param lines - Array of reference text lines
 * @param ENTER_CHAR - Character used to represent Enter key
 * @returns Accuracy percentage (0-100)
 */
export function calculateAccuracy(
  lineInputs: string[][], 
  lines: string[], 
  ENTER_CHAR: string = '\n'
): number {
  // Collect the entire reference text (with \n)
  const fullText = lines.map((l) => l + ENTER_CHAR).join("");
  const userFull = lineInputs.map((arr) => arr.join("")).join("");
  
  let correct = 0;
  for (let i = 0; i < Math.min(fullText.length, userFull.length); i++) {
    if (userFull[i] === fullText[i]) correct++;
  }
  
  // Errors — these are also extra symbols
  const total = Math.max(fullText.length, userFull.length);
  if (total === 0) return 100;
  
  return Math.round((correct / total) * 100);
} 