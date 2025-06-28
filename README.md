# Type Sprint — Touch Typing Trainer

**🌐 [Try it online](https://type-sprint-lyart.vercel.app/)**

A modern, adaptive touch typing trainer built with React, TypeScript, and Tailwind CSS.

## Features
- **Light/Dark theme** (auto and manual switch with smooth transitions)
- **Dynamic keyboard** (English/Russian/Polish layouts, highlights the required key)
- **Responsive layout** (3/4 width containers, mobile-friendly)
- **Typing texts**: triple texts (en/ru/pl) with synchronized ids
- **Visual feedback**: errors, success, cursor, Enter, spaces
- **Keypress sound** (tap and error sounds)
- **Global key handler** (no input focus required)
- **Routing**: Home, TextSelect, Training, Results, Stats, Login
- **Multilanguage UI**: EN/RU/PL, instant switching
- **Statistics tracking** (localStorage with compact date format)
- **Firebase authentication** (Google Sign-in, optional)
- **Polish character support** (ą, ć, ę, ł, ń, ó, ś, ź, ż with Alt key highlighting)

## Project Structure
```
src/
  components/      — UI components (Header, Keyboard, TypingArea, ThemeSwitch, Card, Layout)
  pages/           — Pages (Home, TextSelect, Training, Results, Stats, Login)
  texts/           — texts.json (EN/RU/PL triple texts)
  theme/           — ThemeProvider, LanguageProvider
  utils/           — detectLayout.ts, calculateWPM.ts, calculateAccuracy.ts
  firebase.tsx     — Firebase configuration and authentication
  index.css        — Tailwind + custom variables + theme switch styling
  main.tsx         — routing and providers
```

## Texts Architecture
- All texts are stored in `src/texts/texts.json` in the format:
```json
[
  {
    "id": "1",
    "en": { "title": "...", "text": "..." },
    "ru": { "title": "...", "text": "..." },
    "pl": { "title": "...", "text": "..." }
  },
  ...
]
```
- When switching language on the training page, the triple text with the same id is loaded and progress is reset.

## Keyboard Features
- **Layout detection**: Automatically detects English, Russian, or Polish text
- **Key highlighting**: Shows the next required key with visual feedback
- **Modifier keys**: Highlights Shift for uppercase letters, Alt for Polish characters
- **Responsive design**: Adapts to different screen sizes
- **Realistic proportions**: Special keys stretch, letters remain fixed size
- **Polish support**: Right Alt key highlights for Polish diacritical characters

## Statistics
- **Local storage**: All typing results saved locally
- **Compact format**: Dates displayed as DD.MM.YY HH:MM
- **Multi-language**: Column headers in user's selected language
- **Text titles**: Shows actual text titles instead of IDs
- **Sorting**: Most recent results appear first

## Getting Started
```bash
npm install
npm run dev
```

## Environment Variables (.env)
To use Firebase authentication and database, create a `.env` file in the project root with your Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase Console (Project Settings > General > Your apps > Firebase SDK snippet).

## Build
```bash
npm run build
```

## Recent Updates
- **Polish language support**: Complete UI translations and text content
- **Enhanced keyboard**: Added Alt, Ctrl, Option keys with proper highlighting
- **Statistics page**: Full implementation with local storage
- **Firebase integration**: Google authentication (optional)
- **Improved UX**: Better keyboard proportions, smooth theme transitions
- **Date formatting**: Compact 2-digit year display in statistics

## Highlights
- All main containers (Header, text selection, training, stats) are centered and use 3/4 width for visual consistency
- Keyboard and TypingArea are fully responsive and follow modern UX patterns
- Polish characters require Alt key combination (highlighted on keyboard)
- Theme switching includes smooth transitions and prevents flash on page load
- Statistics are automatically saved after each completed training session

## TODO / Roadmap
- Implement results page (Results)
- User texts and progress synchronization
- Export/import results
- Improve mobile experience
- Add more text content
- Leaderboards and achievements

---

**Type Sprint** — a fast, modern, and extensible online touch typing trainer with internationalization (EN/RU/PL), Firebase authentication, and comprehensive statistics tracking.
