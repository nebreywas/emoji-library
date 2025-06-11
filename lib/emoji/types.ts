// Type definitions for the AllSpark Emoji System
// These interfaces define the structure of emoji metadata, config, and asset maps.

/**
 * Represents a single emoji entry, including metadata and optional skin/ZWJ variants.
 */
export interface EmojiEntry {
  /** Unicode character for the emoji (e.g., "👋") */
  unicode: string;
  /** Codepoints as uppercase hex, joined by '-' (e.g., "1F44D") */
  codepoints: string;
  /** Descriptive name (e.g., "thumbs up") */
  name: string;
  /** Emoji group (e.g., "Smileys & Emotion") */
  group: string;
  /** Emoji subgroup (e.g., "hand-fingers-closed") */
  subgroup: string;
  /** Developer shortcodes (e.g., [":wave:", ":hand_wave:"]) */
  shortcodes: string[];
  /** Skin tone/variant entries, if any */
  skins?: EmojiEntry[];
  /** True if this is a ZWJ sequence */
  isZWJ?: boolean;
}

/**
 * Maps codepoints to asset paths for a given emoji set.
 * Example: { "1F44D": { assetPath: "/emoji/openmoji/1F44D.png" } }
 */
export interface EmojiSetMap {
  [codepoints: string]: {
    assetPath: string;
    // Optionally support color/bw variants for sets like OpenMoji
    svg?: { color?: string; bw?: string };
    png?: { color?: string; bw?: string };
  };
}

// Remove old EmojiConfig type and refer to EmojiSystemConfig and EmojiSetConfig from config barrel
export type { EmojiSystemConfig, EmojiSetConfig } from '../../config'; 