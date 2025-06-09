import { EmojiEntry, EmojiSetMap } from './types';

/**
 * Resolves an emoji's metadata and asset path for a given codepoint and set.
 * @param codepoint - The emoji codepoint string (e.g., "1F44D")
 * @param setName - The emoji set to use (e.g., "openmoji")
 * @param emojiBase - The base metadata map (codepoint -> EmojiEntry)
 * @param emojiSet - The set asset map (setName -> EmojiSetMap)
 * @returns The merged emoji entry with assetPath, or null if not found
 */
export function resolveEmoji(
  codepoint: string,
  setName: string,
  emojiBase: Record<string, EmojiEntry>,
  emojiSet: Record<string, EmojiSetMap>
): (EmojiEntry & { assetPath: string | null }) | null {
  const base = emojiBase[codepoint];
  const set = emojiSet[setName]?.[codepoint];
  if (!base) return null;
  return {
    ...base,
    assetPath: set?.assetPath || null
  };
} 