# Apna Wakeel: React front end

Simple React (Vite) front end in English and Urdu, with light and dark mode.
Flow: Home, Describe Problem, Follow-up Questions, Analysis, Results. Plus a Login page.

## Run it

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

## Files

```
src/
  App.jsx                   which screen is showing (simple useState, no router)
  styles.css                all styles; brand colors are variables at the top
  pages/                    Home, Login, Describe, FollowUp, Analysis, Results
  components/               Navbar, Footer, FlowSteps, LanguageSwitcher, ThemeToggle,
                            GavelMark (the logo), Icon (simple line icons)
  theme/ThemeContext.jsx    light / dark mode, remembered in the browser
  i18n/
    en.js                   all English text
    ur.js                   all Urdu text
    LanguageContext.jsx     language list, t() function, right-to-left switching
  services/api.js           the ONLY file that calls the back end
  data/demoData.js          demo questions + demo result (English and Urdu)
```

## Look and feel

The visual identity is inspired by the Supreme Court of Pakistan and the gavel:
ivory stone backgrounds, deep dusk-navy for the main colour, muted brass gold for small accents,
and flag green for "done" states. Dark mode is a muted charcoal version of the same palette.

- **All colours** are variables at the top of `src/styles.css` (one block for light, one for dark).
  Change a colour there and it updates everywhere.
- **Logo:** `src/components/GavelMark.jsx` (an SVG that follows the light/dark colours).
  The browser-tab icon is `public/favicon.svg`.
- **Light/dark toggle** is in the navbar. The choice is saved, and until the person chooses
  it follows their device setting.
- **Fonts:** Source Serif 4 for headings, Public Sans for text, Noto Naskh Arabic for Urdu
  (loaded from Google Fonts in `index.html`).

## Languages

Every piece of text on screen comes from `src/i18n/`. In the code you will see `t("nav.login")`,
which means "show the text called nav.login in the current language".

### Add Khowar later

1. Copy `src/i18n/en.js` to `src/i18n/khw.js` and translate the text on the right side of each line.
   Do not change the keys on the left, and keep `{curly}` words as they are.
2. In `src/i18n/LanguageContext.jsx` add:
   ```js
   import khw from "./khw.js";
   ...
   khw: { code: "khw", name: "کھوار", dir: "rtl", strings: khw },
   ```
3. The switcher button appears automatically. Any line you have not translated yet shows in English.
4. For demo content, add a `khw: { ... }` version inside `src/data/demoData.js`.

## Login

The Login page has log in, create account, and "continue without an account".
In demo mode any email/phone and any password of 6+ characters works.

## Connect the back end later

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL=http://localhost:8000` (your teammate's address)
3. Open `src/services/api.js`. It lists every endpoint and the JSON each one sends and returns.

Every request includes `language` ("en", "ur", later "khw") so the back end can answer in that language.
When `VITE_API_URL` is empty, the app uses demo data and shows a "Demo data" label.
