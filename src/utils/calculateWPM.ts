/**
 * Calculate Words Per Minute (WPM) for typing trainer.
 * @param charCount Number of typed characters (optionally only correct ones)
 * @param startTime Typing start timestamp (ms)
 * @param endTime Typing end/current timestamp (ms)
 * @returns WPM (words per minute, rounded to 1 decimal)
 */
export default function calculateWPM(
  charCount: number,
  startTime: number,
  endTime: number
): number {
  if (!charCount || !startTime || !endTime || endTime <= startTime) return 0;
  const minutes = (endTime - startTime) / 60000;
  if (minutes === 0) return 0;
  const words = charCount / 5;
  const wpm = words / minutes;
  return Math.round(wpm * 10) / 10;
}