import { EMOJI_SYSTEM_CONFIG } from '../../config/emoji-system-config';
import type { EmojiSystemConfig } from '../../config/emoji-system-config';
import { TEST } from '../../config/test-config';

/**
 * Returns the emoji system config from the central config file.
 * No longer loads from disk; uses the imported object.
 */
export function loadEmojiConfig(): EmojiSystemConfig {
  return EMOJI_SYSTEM_CONFIG;
} 