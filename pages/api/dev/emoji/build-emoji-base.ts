import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { EMOJI_SYSTEM_CONFIG } from '@config/emoji-system-config';
import { handleApiError } from '../../../../utils/apiError';
import { filenameToCode } from '../../../../lib/emoji/filenameToCode';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sets } = EMOJI_SYSTEM_CONFIG;
    // Build the base emoji map from all sets
    const allCodes = new Set<string>();
    for (const setKey in sets) {
      const setInfo = sets[setKey];
      const assetDir = path.join(process.cwd(), setInfo.assetDir);
      if (!fs.existsSync(assetDir)) {
        continue;
      }
      const files = fs.readdirSync(assetDir).filter(f => f.endsWith(setInfo.ext));
      for (const file of files) {
        const code = filenameToCode(setKey, file);
        if (code) allCodes.add(code);
      }
    }
    if (allCodes.size === 0) {
      return res.status(400).json({ success: false, error: 'No emoji assets found in any set directories.' });
    }
    // Build base map: code -> { code }
    const base: Record<string, { code: string }> = {};
    for (const code of allCodes) {
      base[code] = { code };
    }
    const outPath = path.join(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');
    fs.writeFileSync(outPath, JSON.stringify(base, null, 2), 'utf-8');
    return res.status(200).json({ success: true, data: { count: Object.keys(base).length, outPath } });
  } catch (err: any) {
    handleApiError(res, err.message || 'Internal server error', 'INTERNAL_ERROR', 500, '/api/dev/emoji/build-emoji-base');
  }
} 