import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const EMOJI_BASE_PATH = path.join(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');
const IAMCAL_URL = 'https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Load emoji-base.json
    if (!fs.existsSync(EMOJI_BASE_PATH)) {
      return res.status(400).json({ success: false, error: 'emoji-base.json not found. Build base first.' });
    }
    const baseRaw = fs.readFileSync(EMOJI_BASE_PATH, 'utf-8');
    const emojiBase = JSON.parse(baseRaw);

    // Download iamcal emoji.json
    const iamcalRes = await fetch(IAMCAL_URL);
    if (!iamcalRes.ok) {
      return res.status(500).json({ error: 'Failed to download iamcal emoji.json' });
    }
    const iamcalList = await iamcalRes.json();

    // Build a map from unified codepoint to iamcal entry
    const iamcalMap: Record<string, any> = {};
    for (const entry of iamcalList) {
      if (entry.unified) iamcalMap[entry.unified.toUpperCase()] = entry;
    }

    // Merge iamcal data into emojiBase
    let updated = 0;
    for (const code in emojiBase) {
      const iamcal = iamcalMap[code.toUpperCase()];
      if (iamcal) {
        emojiBase[code].iamcal = {
          short_names: iamcal.short_names || [],
          keywords: iamcal.keywords || [],
          category: iamcal.category || '',
          added_in: iamcal.added_in || ''
        };
        // Merge short_names into a top-level shortcodes array (deduped)
        const shortcodes = new Set([
          ...(emojiBase[code].shortcodes || []),
          ...(iamcal.short_names || [])
        ]);
        emojiBase[code].shortcodes = Array.from(shortcodes).filter(Boolean);
        updated++;
      }
    }

    // Write updated emojiBase
    fs.writeFileSync(EMOJI_BASE_PATH, JSON.stringify(emojiBase, null, 2), 'utf-8');
    return res.status(200).json({ success: true, data: { updated, total: Object.keys(emojiBase).length } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
} 