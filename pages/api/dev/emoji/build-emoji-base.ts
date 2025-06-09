import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Unicode emoji-test.txt source
const EMOJI_TEST_URL = 'https://unicode.org/Public/emoji/latest/emoji-test.txt';

// Helper to parse emoji-test.txt
function parseEmojiTest(txt: string) {
  const lines = txt.split(/\r?\n/);
  const result: Record<string, any> = {};
  let group = '';
  let subgroup = '';
  for (const line of lines) {
    if (line.startsWith('# group:')) {
      group = line.replace('# group: ', '').trim();
    } else if (line.startsWith('# subgroup:')) {
      subgroup = line.replace('# subgroup: ', '').trim();
    } else if (line.match(/^([0-9A-F ]+); fully-qualified/)) {
      // Example: "1F600                                      ; fully-qualified     # 😀 grinning face"
      const match = line.match(/^([0-9A-F ]+); fully-qualified\s+# (\S+) (.+)$/);
      if (match) {
        const codepoints = match[1].trim().split(' ').map(cp => cp.padStart(4, '0')).join('-').toUpperCase();
        const unicode = match[2];
        const name = match[3];
        result[codepoints] = {
          unicode,
          name,
          group,
          subgroup,
          codepoints,
        };
      }
    }
  }
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Download emoji-test.txt
    const response = await fetch(EMOJI_TEST_URL);
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to download emoji-test.txt' });
    }
    const txt = await response.text();
    // Parse
    const emojiBase = parseEmojiTest(txt);
    // Write to /public/dev/emoji/emoji-base.json
    const outPath = path.join(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(emojiBase, null, 2), 'utf-8');
    return res.status(200).json({ status: 'ok', count: Object.keys(emojiBase).length, outPath });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
} 