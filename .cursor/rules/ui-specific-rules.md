# Cursor UI Rules – AllSpark Projects

## 🤖 AI Coding Agent UI Guidance
This file defines the rules AI agents must follow when writing UI code for AllSpark or compatible projects.

> **Note:** For any questions of UI intent, class usage, or ambiguous terminology, always refer to [`specs/ui-glossary.md`](../../specs/ui-glossary.md) as the source of truth. The glossary provides mappings, examples, and definitions for DaisyUI, Tailwind, and base class conventions.

---

## 🧠 Core Directives
- Use **DaisyUI components and classes** for all visual UI.
- Use `.app-*-base` classes for layout, spacing, and structural consistency, as described in the [UI Glossary](../../specs/ui-glossary.md).
- **Do not use `@apply` on DaisyUI classes** — this breaks compilation.
- React components should be styled using `className` attributes, not new CSS classes.

---

## ⚛️ React-Specific Rules
- Never use `.app-*-base` classes without DaisyUI class counterparts (see [UI Glossary](../../specs/ui-glossary.md)).
- Always apply visual styling directly in `className`, not in CSS modules or styled-components.
- Prefer functional React components that return clean DaisyUI + base-class markup.
- Use JSX fragments or `div` wrappers sparingly — structure should be minimal.

```tsx
// ✅ Do
<input className="input input-bordered app-input-base" />
<button className="btn btn-primary app-btn-base">Save</button>

// ❌ Do Not
<input className={styles.input} />
<button style={{ padding: '12px' }}>Click</button>
```

---

## ✅ Always Do
- Combine DaisyUI and `.app-*-base` in TSX:
```tsx
<button className="btn btn-primary app-btn-base">Click Me</button>
<input className="input input-bordered app-input-base" />
```
- Reference `appstyle.css` for base structural classes
- Use base classes (e.g., `app-card-base`, `app-modal-base`, `app-section-header-base`) as described in the [UI Glossary](../../specs/ui-glossary.md) to ensure layout/padding consistency
- Use Tailwind utilities for:
  - Spacing (`px-4`, `mb-2`)
  - Flex/grid layouts (`flex`, `grid-cols-2`)
  - Responsive behavior (`md:w-1/2`, `hidden md:block`)

---

## ❌ Never Do
- Don’t create new `.css` classes for visual tweaks — use Tailwind
- Don’t `@apply` DaisyUI classes like `btn`, `card`, `badge`, etc.
- Don’t mix non-Daisy UI libraries (e.g. Bootstrap, shadcn, Chakra)
- Don’t use custom component libraries unless explicitly allowed

---

## 📦 Base Class Usage
- For all base class usage, refer to the [UI Glossary](../../specs/ui-glossary.md) for the correct class combinations and intent.
- Do not duplicate base class maps here; the glossary is the canonical source.
- When adding new base classes, follow the `.app-[element]-base` naming format, use only Tailwind in `@apply`, and include a TSX usage example in the glossary if needed.

---

## 🎨 Theme Usage
- Use DaisyUI semantic classes like `bg-base-100`, `text-primary`, `badge-secondary`
- Avoid hardcoded hex colors, use theme tokens

---

## 🧪 Testing & Review Expectations
- Outputs must be visually consistent with established patterns
- Only use non-standard class combos if approved by human dev
- New patterns must be documented in the UI Spec and/or [UI Glossary](../../specs/ui-glossary.md)

---

## 🔗 Resources
- Base Style Reference: Inlined into `@globals.css`
- UI Glossary: [`specs/ui-glossary.md`](../../specs/ui-glossary.md)
- UI Framework Spec: `UI_Framework_Spec.md`
- DaisyUI Docs: [https://daisyui.com/components](https://daisyui.com/components)
- Tailwind Docs: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

> These rules are enforced to maintain visual consistency, reduce technical debt, and ensure easy scalability of the AllSpark UI framework.
