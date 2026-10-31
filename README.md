# The First Gym

Website for **The First Gym** in Hay El Mostasharin, Zagazig: classes and a weekly timetable, coaches, membership with a plan finder, body calculators, opening hours and directions. English and Arabic, dark and light.

![Home page, English, dark theme](docs/screenshots/home-en-dark.jpg)

| Arabic, light theme | Phone |
| --- | --- |
| ![Home page in Arabic, light theme](docs/screenshots/home-ar-light.jpg) | <img src="docs/screenshots/phone-home.jpg" alt="Home page on a phone" width="300"> |

## What's on it

- **3D hero.** A black bumper plate stamped "1 ST" rolls in from the edge of the screen and settles beside the headline, lit by yellow strips like the LED lines in the gym. It turns gently toward the pointer. three.js loads only with the hero, and a flat drawing of the same plate stands in until it's ready (or if WebGL isn't available).
- **Classes.** Fitness, Kickboxing and MMA (men, women and kids) and Zumba, Aerobics, Yoga and Dance (women), with a filter by who they're for and a Saturday-to-Friday timetable that highlights today in Cairo time.
- **Membership.** Plan lengths shown as plates on a lit floor line (the longer the plan, the bigger the plate), and a four-question plan finder that suggests classes and opens WhatsApp with a ready message starting with START, the word the gym asks for.
- **Body Lab.** BMI with the WHO bands, daily calories (Mifflin-St Jeor) for losing, keeping or gaining weight, and a protein range. Accepts Arabic-Indic digits. Points visitors to the gym's InBody scans for real body-composition numbers.
- **Visit.** Address and landmark, Google Maps directions to the gym's pin, call, WhatsApp, Instagram and Facebook links, opening hours with a live "open now" line, and questions answered from the gym's own posts.
- **English and Arabic** with full right-to-left layout, Arabic-Indic digits and plural forms. Arabic copy addresses visitors in the plural, so it reads the same for everyone.
- **Dark and light themes**, an animations switch in the footer (it starts from the system's reduced-motion setting), keyboard focus that follows page changes, and a styled scrollbar.

## Facts and placeholders

Every fact lives in [`src/data/gym.js`](src/data/gym.js), taken from the gym's [Facebook page](https://www.facebook.com/TheFirstGym1) and its Google Maps listing. Nothing is invented: anything the gym hasn't published is `null` and shows on the site with a strip of hazard tape and "To be added". Still to come from the gym:

- Membership prices
- Opening hours confirmation (the times come from Google Maps; Facebook only says "open 7 days a week"). Set `hours.confirmed` to `true` once confirmed.
- Days and times for MMA, Zumba, Aerobics, Yoga and Dance, and the Kickboxing time
- The rest of the coaching team and coach photos
- Photos of the gym (`GALLERY`) and the logo file

## Stack

React 19, JavaScript, Vite, React Router, three.js with React Three Fiber, Vitest with Testing Library, ESLint, and GitHub Actions (lint, test and build on every push). Fonts are self-hosted: Big Shoulders Display and Reem Kufi for headings, Readex Pro for text.

## Scripts

```bash
npm install
npm run dev      # local server
npm test         # 48 tests
npm run lint
npm run build    # production build in dist/
```

## Deploying

`vercel.json` serves the single-page app and sends security headers, including a Content-Security-Policy that allows the one inline script in `index.html` (it applies the saved language and theme before the first paint) by its hash. If that script changes, update the hash; `src/test/csp.test.js` fails until they match.
