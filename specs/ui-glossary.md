# UI Glossary: DaisyUI & Tailwind Mapping

> **AI/Automation Note:** This glossary is intended for both human and AI coding agents. When in doubt, prefer the mappings and conventions here over ad-hoc class combinations.

This glossary maps common UI intent or design commands to the appropriate DaisyUI/Tailwind classes or attributes. The goal is to reduce ambiguity, increase semantic standardization, and help both humans and AI coding agents translate design intent into code with minimal errors.

> Anything referring to "base" or "base-" such as "base table" or "base button" means to use the base class names described in [`globals.css`](../styles/globals.css)

---

## 🔁 Intent → Class Reference

| UI Command/Intent         | DaisyUI/Tailwind Class or Attribute             | Notes/Example Usage                                         |
|--------------------------|-------------------------------------------------|-------------------------------------------------------------|
| Thin range slider        | `[--range-fill:0]`                              | `<input type="range" class="range [--range-fill:0]" />`    |
| Section header           | [`app-section-header-base`](../styles/globals.css) |                                                             |
| Alert info               | `alert alert-info` + [`app-alert-base`](../styles/globals.css) |                                                             |
| Progress bar             | `progress progress-primary` + [`app-progress-base`](../styles/globals.css) |                                                             |
| Zebra row styling        | `table-zebra`                                   | Use on `<table class="table table-zebra">`                 |
| Active row highlight     | `hover:bg-*`, `bg-primary` or row state style   | Used on `tr` for selection feedback                         |
| Pinned rows              | `table-pin-rows`                                | Daisy variant for scrollable table w/ frozen rows          |
| Pinned columns           | `table-pin-cols`                                | Daisy variant for scrollable table w/ frozen columns       |
| Tabs with radios         | `tabs`, `tab`, `input[type=radio]` combo        | Used for tab state persistence with radios                 |
| Toast message            | `toast` + `alert` variant                       | Usually inside a `.toast` container                        |
| Drawer/sidebar           | `drawer`                                        | Use for left/right sliding panels                          |
| Daisy navbar             | `navbar`                                        | Use for top nav layout                                     |
| Daisy collapse           | `collapse` + `collapse-title/content` structure | Hide/show toggle                                            |
| Daisy countdown          | `countdown`                                     | Time display UI element                                    |
| Daisy skeleton           | `skeleton`                                      | Placeholder for loading state                              |
| Swap (icon/text toggle)  | `swap`, `swap-on`, `swap-off`                   | Toggle between two UI states (like icons)                  |
| Keyboard shortcut (kbd)  | `kbd`                                           | Highlight shortcut keys                                    |
| Radial progress          | `radial-progress`                                | Displays circular progress bar                            |

## Examples of "base" class terms ##

This list provides examples of how to use "base" class terms in conjunction with DaisyUI and Tailwind CSS. These examples are not exhaustive but illustrate common patterns for applying consistent styling across UI components.

| Component Base Term      | Class Combination                                      | Description                                             |
|--------------------------|--------------------------------------------------------|---------------------------------------------------------|
| Checkbox base            | `checkbox` + [`app-checkbox-base`](../styles/globals.css) | Used for styling checkboxes with consistent appearance. |
| Toggle base              | `toggle` + [`app-toggle-base`](../styles/globals.css) | Used for styling toggle switches with a unified look.   |
| Radio base               | `radio` + [`app-radio-base`](../styles/globals.css) | Used for styling radio buttons consistently.            |
| Tab base                 | `tab` + [`app-tab-base`](../styles/globals.css) | Used for styling tabs with a cohesive design.           |
| Button base              | `btn` + [`app-btn-base`](../styles/globals.css) | Used for styling buttons with a standard appearance.    |
| Input base               | `input` + [`app-input-base`](../styles/globals.css) | Used for styling input fields uniformly.                |
| Alert base               | `alert` + [`app-alert-base`](../styles/globals.css) | Used for styling alert messages consistently.           |

These examples help ensure that UI components maintain a consistent look and feel across the application by leveraging predefined base styles.

---

## 🎨 Sizing Conventions
These are the five base sizes DaisyUI supports

| Size    | Abbreviation | Description   |
|---------|--------------|---------------|
| Xsmall  | `xs`         | Extra Small   |
| Small   | `sm`         | Small         |
| Medium  | `md`         | Medium        |
| Large   | `lg`         | Large         |
| XLarge  | `xl`         | Extra Large   |

---

## 🎛 Key Daisy Variants

### Dropdown Variants
- `details` – Uses the `<details>` HTML element to toggle dropdown visibility
- `popover` – Creates a floating menu anchored to a trigger
- `cssfocus` – Uses CSS `:focus` and `:hover` to toggle dropdown visibility

### Modal Variants
- `closebox` – Includes a close button (`✕`) in the top right of the modal
- `outside` – Clicking outside the modal closes it
- `corner` – Modal appears from a corner rather than centered
- `custom-width` – Adjusts modal width manually via Tailwind (e.g. `max-w-lg`)
- `responsive` – Modals that resize or adjust layout based on screen size

### Tab Variants
- `lift` – Tabs are elevated with shadow
- `box` – Tabs are styled with box outlines
- `box using radio inputs` – Uses hidden radios to persist tab selection state

### Loading Variants
- `spinner` – Circular spinner (default)
- `dots` – Three animated dots
- `ring` – Expanding ring animation
> Do not use other loading variants unless specified

### Join Variants
- `join-item` – Makes an item part of a group (e.g. pagination)
- `join-vertical` – Stack items vertically as a group
- `join-horizontal` – Stack items horizontally

### Label Variants
- For input – Standard form label above input
- For input at the end – Label appears after input, common for toggles
- For select – Associated with dropdown
- Floating label – Label that moves when input is focused/filled

---

## 🧱 Generic UI Terms

| Term                | Definition / Use Case Example |
|---------------------|-------------------------------|
| Sticky              | An element that remains fixed during scroll until displaced (e.g., sticky header) |
| Popover             | A small floating panel, often anchored to a button or link, used for context or actions |
| Dialog              | A modal-style interaction window that requires a decision (like confirmation dialogs) |
| Filter row          | A row of inputs, dropdowns, or checkboxes used to filter data in a table or list |
| Pagination controls | UI buttons or links to move between pages of data (e.g., Previous/Next) |
| Empty state         | A UI pattern for showing feedback when no data is present (e.g., "No results found") |
| Loading state       | A placeholder UI shown while data is loading (e.g., spinner or skeleton) |

---

## 🧭 Usage Guidelines

**How to use this glossary:**
- When a spec or comment contains ambiguous UI terminology (e.g. "ghost button", "zebra row", "toast"), refer to this document.
- Align both code implementation and written design/engineering communication with these terms.
- Expand this list as new DaisyUI patterns or custom extensions emerge.
- Expand this list if you encounter difference between your understanding of terminology and your collaborators

**Purpose:**
- Reduce ambiguity for both human and AI developers.
- Encourage consistent, spec-compliant UI implementation.
- Make onboarding and code review easier.

---

> Refer to [https://daisyui.com/docs/](https://daisyui.com/docs/) for further exploration of DAISY specifics and DAISY variants and composition patterns.