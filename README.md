# Type Sprint — Touch Typing Trainer

A modern, adaptive touch typing trainer built with React, TypeScript, and Tailwind CSS.

## Features
- **Light/Dark theme** (auto and manual switch)
- **Dynamic keyboard** (Russian/English layouts, highlights the required key)
- **Responsive layout** (3/4 width containers, mobile-friendly)
- **Typing texts**: twin texts (en/ru) with synchronized ids
- **Visual feedback**: errors, success, cursor, Enter, spaces
- **Keypress sound**
- **Global key handler** (no input focus required)
- **Routing**: Home, TextSelect, Training, Results (stub)
- **Multilanguage UI**: EN/RU, instant switching

## Project Structure
```
src/
  components/      — UI components (Header, Keyboard, TypingArea, ThemeSwitch, Card, Layout)
  pages/           — Pages (Home, TextSelect, Training, Results, LoginPage, Stats)
  texts/           — texts.json (EN/RU twin texts)
  theme/           — ThemeProvider, LanguageProvider
  utils/           — detectLayout.ts
  index.css        — Tailwind + custom variables
  main.tsx         — routing and providers
```

## Texts Architecture
- All texts are stored in `src/texts/texts.json` in the format:
```json
[
  {
    "id": "1",
    "en": { "title": "...", "text": "..." },
    "ru": { "title": "...", "text": "..." }
  },
  ...
]
```
- When switching language on the training page, the twin text with the same id is loaded and progress is reset.

## Getting Started
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Highlights
- All main containers (Header, text selection, training) are centered and use 3/4 width for visual consistency.
- Keyboard and TypingArea are fully responsive and follow modern UX patterns.
- Future features: **Stats**, **Login**, **Results** pages are already stubbed in routing and header, to be implemented in next versions.

## TODO / Roadmap
- Implement statistics page (Stats)
- Implement results page (Results)
- Authentication and login page (Login)
- User texts and progress
- Export/import results
- Improve mobile experience

---

**Type Sprint** — a fast, modern, and extensible online touch typing trainer with internationalization (EN/RU) and a clean UI/UX.
