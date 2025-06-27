export function detectLayout(text: string): "en" | "ru" {
  // If there's at least one Latin letter, consider it English
  if (/[a-z]/i.test(text)) return "en";
  // If there's at least one Cyrillic letter, consider it Russian
  if (/[а-яё]/i.test(text)) return "ru";
  // Default to English
  return "en";
}