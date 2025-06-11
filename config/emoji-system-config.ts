// Combined emoji system config for asset management, mapping, and runtime settings
// This centralizes all system settings and set definitions in one place

export interface EmojiSetConfig {
    name: string;
    assetDir: string;
    ext: string;
    filename: (code: string) => string;
    assetPath: (code: string) => string;
    case: 'lower' | 'upper' | 'asis';
    notes?: string;
    installInstructions?: string; // Markdown string with install instructions
}

export interface EmojiSystemConfig {
    activeSet: string;
    fallbackSet: string;
    grayscale: boolean;
    shortcodesEnabled: boolean;
    sets: Record<string, EmojiSetConfig>;
}

export const EMOJI_SYSTEM_CONFIG: EmojiSystemConfig = {
    activeSet: 'openmoji',
    fallbackSet: 'twemoji',
    grayscale: false,
    shortcodesEnabled: true,
    sets: {
        openmoji: {
            name: 'OpenMoji',
            assetDir: 'public/emoji/openmoji',
            ext: '.svg',
            filename: (code) => `${code.toUpperCase()}.svg`,
            assetPath: (code) => `/emoji/openmoji/${code.toUpperCase()}.svg`,
            case: 'upper',
            installInstructions: `Instructions for installing **OpenMoji** assets will go here.\n\n_(No instructions yet. Please add them in the future.)_`,
        },
        twemoji: {
            name: 'Twemoji',
            assetDir: 'public/emoji/twemoji',
            ext: '.svg',
            filename: (code) => `${code.toLowerCase()}.svg`,
            assetPath: (code) => `/emoji/twemoji/${code.toLowerCase()}.svg`,
            case: 'lower',
            installInstructions: `To add the latest **Twemoji** SVG assets to your project, follow these steps:\n\n1. **Download or clone the Twemoji repository from GitHub:**\n   https://github.com/twitter/twemoji\n\n2. **Copy the \`assets/svg/\` folder from the repository into your project at \`public/emoji/twemoji/\` by hand.**\n\n> **Why?** Twitter no longer provides a standalone SVG zip or npm package with SVGs. Manual copying is required.\n\n_After copying, reference SVGs from \`public/emoji/twemoji/svg/\` in your app._`,
        },
        blobmoji: {
            name: 'Blobmoji',
            assetDir: 'public/emoji/blobmoji',
            ext: '.svg',
            filename: (code) => `emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
            assetPath: (code) => `/emoji/blobmoji/emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
            case: 'lower',
            notes: 'Filenames are prefixed with emoji_u and use underscores between codepoints',
            installInstructions: `Instructions for installing **Blobmoji** assets will go here.\n\n_(No instructions yet. Please add them in the future.)_`,
        },
        notomoji: {
            name: 'Noto Emoji',
            assetDir: 'public/emoji/notomoji',
            ext: '.svg',
            filename: (code) => `emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
            assetPath: (code) => `/emoji/notomoji/emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
            case: 'lower',
            notes: 'Filenames are prefixed with emoji_u and use underscores between codepoints',
            installInstructions: `Instructions for installing **Noto Emoji** assets will go here.\n\n_(No instructions yet. Please add them in the future.)_`,
        },
        sensamoji: {
            name: 'Sensa',
            assetDir: 'public/emoji/sensamoji',
            ext: '.svg',
            filename: (code) => `${code}.svg`, // Placeholder, Sensa uses plain names, not codepoints
            assetPath: (code) => `/emoji/sensamoji/${code}.svg`,
            case: 'asis',
            notes: 'Filenames are plain English names, not codepoints. Needs custom mapping.',
            installInstructions: `Instructions for installing **Sensa** assets will go here.\n\n_(No instructions yet. Please add them in the future.)_`,
        },
    },
}; 