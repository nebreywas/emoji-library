import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const EMOJI_BASE_PATH = path.join(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Load emoji-base.json
    if (!fs.existsSync(EMOJI_BASE_PATH)) {
      return res.status(400).json({ error: 'emoji-base.json not found. Build base first.' });
    }
    const baseRaw = fs.readFileSync(EMOJI_BASE_PATH, 'utf-8');
    const emojiBase = JSON.parse(baseRaw);

    // Download gemoji emoji.json
    const gemojiRes = await fetch(GEMOJI_URL);
    if (!gemojiRes.ok) {
      return res.status(500).json({ error: 'Failed to download gemoji emoji.json' });
    }
    const gemojiList = await gemojiRes.json();

    // Build a map from unicode char to gemoji entry
    const gemojiMap: Record<string, any> = {};
    for (const entry of gemojiList) {
      if (entry.emoji) gemojiMap[entry.emoji] = entry;
    }

    // Merge gemoji data into emojiBase
    let updated = 0;
    for (const code in emojiBase) {
      const unicode = emojiBase[code].unicode;
      const gemoji = gemojiMap[unicode];
      if (gemoji) {
        emojiBase[code].gemoji = {
          aliases: gemoji.aliases || [],
          tags: gemoji.tags || [],
          description: gemoji.description || '',
          category: gemoji.category || ''
        };
        // Merge aliases/tags into a top-level shortcodes array (deduped)
        const shortcodes = new Set([
          ...(emojiBase[code].shortcodes || []),
          ...(gemoji.aliases || []),
          ...(gemoji.tags || [])
        ]);
        emojiBase[code].shortcodes = Array.from(shortcodes).filter(Boolean);
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