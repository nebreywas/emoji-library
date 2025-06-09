import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const EMOJI_BASE_PATH = path.join(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');

// Unicode skin tone modifier codepoints and their labels
const SKIN_TONE_MODIFIERS: Record<string, string> = {
  '1F3FB': 'light',
  '1F3FC': 'medium-light',
  '1F3FD': 'medium',
  '1F3FE': 'medium-dark',
  '1F3FF': 'dark',
};

function getSkinTone(code: string): string {
  // If the code includes a skin tone modifier, return the label
  for (const mod in SKIN_TONE_MODIFIERS) {
    if (code.toUpperCase().includes(mod)) return SKIN_TONE_MODIFIERS[mod];
  }
  // Otherwise, it's the default (yellow/neutral)
  return 'default';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Load emoji-base.json
    if (!fs.existsSync(EMOJI_BASE_PATH)) {
      return res.status(400).json({ error: 'emoji-base.json not found. Build base first.' });
    }
    const baseRaw = fs.readFileSync(EMOJI_BASE_PATH, 'utf-8');
    const emojiBase = JSON.parse(baseRaw);

    let updated = 0;
    for (const code in emojiBase) {
      const skinTone = getSkinTone(code);
      if (emojiBase[code].skin_tone !== skinTone) {
        emojiBase[code].skin_tone = skinTone;
        updated++;
      }
    }

    // Write updated emojiBase
    fs.writeFileSync(EMOJI_BASE_PATH, JSON.stringify(emojiBase, null, 2), 'utf-8');
    return res.status(200).json({ status: 'ok', updated, total: Object.keys(emojiBase).length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
} 