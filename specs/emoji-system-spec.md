# 🧱 AllSpark Emoji System

A modular, image-based emoji framework for expressive, themeable, and consistent use across AllSpark's games, UI, and messaging layers.

---

## 🎯 Project Goals

- Provide consistent, font-independent emoji rendering via local image assets.
- Support multiple emoji sets (Twemoji, OpenMoji, Blobmoji, Sensa, etc.).
- Enable optional visual theming: grayscale, opacity, scale, and CSS filters.
- Offer shortcode mapping (`:wave:` → 👋), skin tone modifiers, and ZWJ handling.
- Integrate seamlessly with AllSpark's rendering and configuration systems.

---

## 🧠 System Responsibilities

- Organize emoji/icon assets as file-based resources
- Map Unicode and shortcodes to metadata and file paths
- Enable config-driven emoji set enable/disable logic
- Render in both React and generic environments (CLI, Markdown, etc.)
- Support set-specific install/uninstall/update workflows

---

## 📁 File & Directory Structure

```bash
/public/emoji/                # Emoji image assets by vendor
  └── openmoji/
  └── twemoji/
  └── blobmoji/
  └── sensa/
  └── fxemoji/

/config/emoji.json            # Emoji system config
/config/icons.json            # Icon system config

/lib/emoji/                   # Runtime metadata
/scripts/emoji/               # Build + parsing tools
```

---

## 🔧 Emoji Configuration

```ts
export const EmojiConfig = {
  activeSet: 'openmoji',
  fallbackSet: 'twemoji',
  grayscale: false,
  shortcodesEnabled: true
};
```

---

## ✅ Supported Emoji Sets

| Set         | Notes |
|-------------|-------|
| **OpenMoji**| Default; supports B/W variants |
| **Twemoji** | Stable, widely adopted |
| **Noto**    | Google's emoji set |
| **Blobmoji**| Supported; install under `/emoji/blobmoji/` |
| **FxEmoji** | Optional legacy set; large files; opt-in only |
| **Sensa**   | Manually mapped; partial coverage; license-compliant |

📝 **Do Not Use (Disallowed Sets):**

- Apple (prohibited)
- Facebook (license-incompatible)
- Emojidex (proprietary CDN)
- Font Awesome (icons, not emojis)
- emoji-mart (picker only)
- react-emoji-render (runtime-heavy)

---

## 📦 Emoji Asset Handling

- All assets stored locally (`/public/emoji/[set]/`)
- Asset paths are resolved at runtime; no inline imports
- CDN source paths can be stored in config for update-checking (not live use)

---

## 🗃 Emoji Metadata Architecture

### Core Files

| File                          | Description |
|-------------------------------|-------------|
| `emoji-base.json`             | Parsed Unicode data (emoji, name, group, ZWJ, tone support) |
| `emoji-[set].json`            | Maps codepoints to asset paths (e.g., Twemoji, OpenMoji) |
| `emoji-gemoji-shortcodes.json`| Shortcode mappings (optional) |

### Schema

```ts
interface EmojiEntry {
  unicode: string
  codepoints: string
  name: string
  group: string
  subgroup: string
  shortcodes: string[]
  skins?: EmojiEntry[]
  isZWJ?: boolean
}
```

---

## ⚙️ Parser Pipeline

### Step 1: Parse Unicode Emoji List

- Input: https://unicode.org/Public/emoji/16.0/emoji-test.txt
- Output: `emoji-base.json`
- Captures:
  - emoji
  - name
  - group / subgroup
  - codepoints (including ZWJ sequences)
  - skin tone modifiers (linked as variants)

### Step 2: Merge Shortcodes

- Merge shortcodes from:
  - https://github.com/iamcal/emoji-data
  - https://github.com/github/gemoji
- Output: enriched `shortcodes` field

### Step 3: Build Per-Set Maps

- Use `build-set-map.js` to scan asset folders and map filenames to codepoints
- Output: `emoji-[setname].json`

---

## 🔎 Runtime Resolution

```ts
function resolveEmoji(codepoint: string, setName: string) {
  const base = emojiBase[codepoint];
  const set = emojiSet[setName]?.[codepoint];
  return {
    ...base,
    assetPath: set?.assetPath || null
  };
}
```

---

## 🖼 Rendering

### React Component

```tsx
<Emoji code="1F44D" variant="twemoji" grayscale />
```

### Fallback

```html
<img src="/emoji/openmoji/1F44D.png" alt="thumbs up" class="emoji-grayscale">
```

---

## 🎨 Theming & Filters

```css
.emoji-grayscale {
  filter: grayscale(100%);
}
```

- Dev Panel Options:
  - Toggle grayscale
  - Select emoji set
  - Preview emoji in color vs. B/W

---

## 🖤 OpenMoji B/W Variant Support

```ts
{
  "1F600": {
    name: "grinning face",
    svg: {
      color: "/emoji/openmoji/svg/color/1F600.svg",
      bw: "/emoji/openmoji/svg/black/1F600.svg"
    },
    png: {
      color: "/emoji/openmoji/png/color/1F600.png",
      bw: "/emoji/openmoji/png/black/1F600.png"
    }
  }
}
```
