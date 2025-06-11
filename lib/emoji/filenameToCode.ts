import { EMOJI_SYSTEM_CONFIG } from '../../config';

/**
 * Extracts the emoji code from a filename for a given set key.
 * Returns null if the filename does not match the expected pattern.
 */
export function filenameToCode(setKey: string, filename: string): string | null {
  const set = EMOJI_SYSTEM_CONFIG.sets[setKey];
  if (!set) return null;
  if (!filename.endsWith(set.ext)) return null;
  const base = filename.slice(0, -set.ext.length);
  switch (setKey) {
    case 'openmoji':
      return base.toUpperCase();
    case 'twemoji':
      return base.toLowerCase();
    case 'blobmoji':
    case 'notomoji':
      if (!base.startsWith('emoji_u')) return null;
      return base.slice(7).replace(/_/g, '-').toLowerCase();
    case 'sensamoji':
      // For sensamoji, the filename is the plain name (no codepoints)
      return base;
    default:
      return null;
  }
} 