export function detectLayout(text: string): "ru" | "en" {
  // Если есть хотя бы одна кириллическая буква — считаем русским
  if (/[а-яё]/i.test(text)) return "ru";
  // Если есть хотя бы одна латиница — считаем английским
  if (/[a-z]/i.test(text)) return "en";
  // По умолчанию — русская
  return "ru";
}