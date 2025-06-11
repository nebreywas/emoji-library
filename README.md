# Next Platform Template

This repository provides a basic template for building web applications using Next.js, React, Tailwind CSS, and related modern frontend tooling. It is designed to be a starting point for new projects, offering a clean and minimal setup with essential configuration and styling out of the box.

## Core Technologies & Versions

The following core dependencies are included in this template, with their exact installed versions:

- **Next.js**: 14.2.28  
  The React framework for production.
- **React**: 18.2.0  
  The core UI library.
- **React DOM**: 18.2.0  
  React's DOM bindings for the web.
- **Tailwind CSS**: 3.4.17  
  Utility-first CSS framework for rapid UI development.
- **DaisyUI**: 4.10.2  
  Tailwind CSS component library for beautiful UI themes.
- **PostCSS**: 8.4.35  
  Tool for transforming CSS with JavaScript plugins.
- **Autoprefixer**: 10.4.21  
  PostCSS plugin to parse CSS and add vendor prefixes.

All of the above are licensed under the MIT license.

## Project Structure

- `pages/` — Next.js pages (routes)
- `styles/` — Global and component CSS (Tailwind included)
- `public/` — Static assets
- `docs/` — Documentation (optional)
- `specs/` — Specifications or tests (optional)

## Usage

### Development
```bash
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production
```bash
npm run build
npm start
```

## Styling
- Tailwind CSS is configured via `tailwind.config.js` and enabled in `styles/globals.css`.
- DaisyUI themes are enabled by default; you can customize or add your own in the config.

## Notes
- The default theme is set to `light` in `pages/_app.js` for consistent SSR/CSR rendering.
- This template is suitable for deployment on Vercel, Digital Ocean, or any Node.js-compatible host.

---

## 🧱 Emoji System (In Progress)

A modular, image-based emoji framework for expressive, themeable, and consistent use across AllSpark's games, UI, and messaging layers.

- **Location:** `/lib/emoji/` (TypeScript)
- **Assets:** `/public/emoji/[set]/`
- **Config:** `/config/emoji.json`

### Initial Implementation Plan
1. Scaffold `/lib/emoji/` directory and TypeScript interfaces.
2. Create the config file and loader.
3. Implement the emoji resolver function.
4. Scaffold the React component (SSR-compatible, with theming context + prop).
5. (Next step) Build the asset download tool as a dev-only page.

See `specs/emoji-system-spec.md` for full details.

### Example: `config/emoji.json`
```json
{
  "activeSet": "openmoji",
  "fallbackSet": "twemoji",
  "grayscale": false,
  "shortcodesEnabled": true
}
```

> Note: The emoji config file is at `config/emoji.json` and does not support comments (standard JSON). See this README and TypeScript types for documentation.

---

*Feel free to fork and adapt this template for your own projects!*

- `/lib/emoji/` will contain TypeScript interfaces and runtime logic for the emoji system.

## Emoji Subsystem

The Emoji Subsystem provides modular, extensible emoji data management, merging, and asset handling for the project. It is designed for easy integration, extension, and maintenance.

### Directory Structure
- `lib/emoji/` — Core emoji logic, config, and utilities
- `public/dev/emoji/` — Generated emoji data files and assets
- `pages/api/dev/emoji/` — API routes for emoji admin/merge actions
- `docs/library-docs/emoji.md` — In-depth documentation (see below)

### Key Features
- Merge and enrich emoji data from multiple sources (e.g., gemoji, iamcal)
- Centralized config for emoji sets and paths
- Admin UI for merging, updating, and browsing emoji data
- Robust error handling and clear user feedback

### How to Extend
- Add a new emoji set: update the config in `lib/emoji/config.ts` and add assets to `public/dev/emoji/`
- Add new merge logic: create a new API route in `pages/api/dev/emoji/`
- Add new admin tools: extend the UI in `pages/dev/emoji-assets.tsx`

For detailed documentation, see [`docs/library-docs/emoji.md`](docs/library-docs/emoji.md). 