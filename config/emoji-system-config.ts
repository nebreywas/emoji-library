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
      },
      twemoji: {
        name: 'Twemoji',
        assetDir: 'public/emoji/twemoji',
        ext: '.svg',
        filename: (code) => `${code.toLowerCase()}.svg`,
        assetPath: (code) => `/emoji/twemoji/${code.toLowerCase()}.svg`,
        case: 'lower',
      },
      blobmoji: {
        name: 'Blobmoji',
        assetDir: 'public/emoji/blobmoji',
        ext: '.svg',
        filename: (code) => `emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
        assetPath: (code) => `/emoji/blobmoji/emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
        case: 'lower',
        notes: 'Filenames are prefixed with emoji_u and use underscores between codepoints',
      },
      notomoji: {
        name: 'Noto Emoji',
        assetDir: 'public/emoji/notomoji',
        ext: '.svg',
        filename: (code) => `emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
        assetPath: (code) => `/emoji/notomoji/emoji_u${code.toLowerCase().replace(/-/g, '_')}.svg`,
        case: 'lower',
        notes: 'Filenames are prefixed with emoji_u and use underscores between codepoints',
      },
      sensamoji: {
        name: 'Sensa',
        assetDir: 'public/emoji/sensamoji',
        ext: '.svg',
        filename: (code) => `${code}.svg`, // Placeholder, Sensa uses plain names, not codepoints
        assetPath: (code) => `/emoji/sensamoji/${code}.svg`,
        case: 'asis',
        notes: 'Filenames are plain English names, not codepoints. Needs custom mapping.',
      },
    },
  }; 