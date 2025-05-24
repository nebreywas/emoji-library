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

*Feel free to fork and adapt this template for your own projects!* 