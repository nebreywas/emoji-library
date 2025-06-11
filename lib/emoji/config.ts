import { EMOJI_SYSTEM_CONFIG } from '../../config';
import type { EmojiSystemConfig } from '../../config';

// Emoji System Configuration
// This file centralizes all configuration for emoji sets, asset paths, and merge logic.
// To add a new emoji set, add an entry to the 'sets' object below and provide the required assets in public/dev/emoji/.
//
// Fields:
// - sets: Mapping of set keys to config (name, asset path, etc.)
// - defaultSet: The default emoji set to use in the system
//
// This config is imported by both backend and frontend logic to ensure consistency.
//
// Example: To add a new set 'myemoji', add:
//   myemoji: { name: 'My Emoji', assetPath: '/dev/emoji/myemoji/' }
// and place assets in public/dev/emoji/myemoji/

/**
 * Returns the emoji system config from the central config file.
 * No longer loads from disk; uses the imported object.
 */
export function loadEmojiConfig(): EmojiSystemConfig {
  return EMOJI_SYSTEM_CONFIG;
} 