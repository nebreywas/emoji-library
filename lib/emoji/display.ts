import { EmojiEntry, EmojiSetMap } from './types';
import { loadEmojiConfig } from './config';
import { resolveEmoji } from './resolve';
import React from 'react';
import type { ReactElement } from 'react';

/**
 * Options for displaying an emoji.
 */
export interface EmojiDisplayOptions {
  set?: string;         // Preferred emoji set
  fallbackSet?: string; // Fallback set if not found
  size?: number;        // Size in px
  className?: string;   // Additional CSS classes
}

/**
 * Normalizes an emoji input (char, codepoint, or shortcode) to a codepoint string.
 * @param input - Emoji character, codepoint, or shortcode
 * @param emojiBase - The emoji metadata map
 * @returns The codepoint string or null if not found
 */
export function normalizeEmojiInput(
  input: string,
  emojiBase: Record<string, EmojiEntry>
): string | null {
  // Direct codepoint match
  if (emojiBase[input]) return input;

  // Unicode char match
  for (const code in emojiBase) {
    if (emojiBase[code].unicode === input) return code;
  }

  // Shortcode match (with or without colons)
  const normalized = input.replace(/^:+|:+$/g, '').toLowerCase();
  for (const code in emojiBase) {
    if (
      emojiBase[code].shortcodes &&
      emojiBase[code].shortcodes.some(
        (sc) => sc.replace(/^:+|:+$/g, '').toLowerCase() === normalized
      )
    ) {
      return code;
    }
  }
  return null;
}

/**
 * Returns a React element for the emoji, using the specified set and fallback logic.
 * Falls back to native rendering if no asset is found.
 *
 * @param input - Emoji char, codepoint, or shortcode
 * @param options - Display options
 * @param emojiBase - Emoji metadata map
 * @param config - Emoji system config
 * @param emojiSet - Asset maps for all sets (setName -> EmojiSetMap)
 * @returns ReactElement (img or span)
 */
export function getEmojiElement(
  input: string,
  options: EmojiDisplayOptions = {},
  emojiBase: Record<string, EmojiEntry>,
  config: ReturnType<typeof loadEmojiConfig>,
  emojiSet: Record<string, EmojiSetMap>
): ReactElement {
  // Determine sets to try
  const sets = [options.set || config.activeSet, options.fallbackSet || config.fallbackSet];

  // Normalize input
  const codepoint = normalizeEmojiInput(input, emojiBase);
  if (!codepoint) {
    // Not found, fallback to native
    return React.createElement('span', null, input);
  }

  // Try active set, then fallback set
  for (const setName of sets) {
    const resolved = resolveEmoji(codepoint, setName, emojiBase, emojiSet);
    if (resolved && resolved.assetPath) {
      return React.createElement('img', {
        src: resolved.assetPath,
        alt: resolved.name,
        title: resolved.name,
        width: options.size,
        height: options.size,
        className: options.className,
        style: options.size ? { width: options.size, height: options.size } : undefined
      });
    }
  }

  // Fallback to native emoji
  return React.createElement('span', null, emojiBase[codepoint]?.unicode || input);
} 