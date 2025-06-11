import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { EMOJI_SYSTEM_CONFIG } from '@config/emoji-system-config';
import { handleApiError } from '../../../../utils/apiError';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { set } = req.query;
    if (!set || typeof set !== 'string' || !(set in EMOJI_SYSTEM_CONFIG.sets)) {
      return handleApiError(res, 'Invalid or missing set key', 'INVALID_SET_KEY', 400, '/api/dev/emoji/build-emoji-set-map');
    }
    const setKey = set as keyof typeof EMOJI_SYSTEM_CONFIG.sets;
    const setInfo = EMOJI_SYSTEM_CONFIG.sets[setKey];
    const metaPath = path.join(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');
    if (!fs.existsSync(metaPath)) {
      return handleApiError(res, 'emoji-base.json not found in public/dev/emoji/. Please generate it first using the "Build Emoji Base" tool.', 'MISSING_EMOJI_BASE', 400, '/api/dev/emoji/build-emoji-set-map');
    }
    const emojiBase = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    const assetDir = path.join(process.cwd(), setInfo.assetDir);
    if (!fs.existsSync(assetDir)) {
      return handleApiError(res, `Asset directory not found: ${setInfo.assetDir}. Please download or install the assets for this set first.`, 'MISSING_ASSET_DIR', 400, '/api/dev/emoji/build-emoji-set-map');
    }
    const files = fs.readdirSync(assetDir).filter(f => f.endsWith(setInfo.ext));
    // Build map: codepoints -> assetPath
    const map: Record<string, { assetPath: string }> = {};

    // Debug: find codepoints with no matching file, and files with no matching codepoint
    const missingFiles: string[] = [];
    const unusedFiles: string[] = [];
    const fileSet = new Set(files);
    for (const code in emojiBase) {
      const fileName = setInfo.filename(code);
      if (!fileSet.has(fileName)) {
        missingFiles.push(`${code} (expected: ${fileName})`);
      }
    }
    const codeSet = new Set(Object.keys(emojiBase).map(code => setInfo.filename(code)));
    for (const file of files) {
      if (!codeSet.has(file)) {
        unusedFiles.push(file);
      }
    }
    const debug = { missingFiles, unusedFiles, manualAssignments: [] as { key: string, file: string }[] };
    // Save debug report to public/dev/emoji/[set]-debug-report.json
    const debugPath = path.join(process.cwd(), 'public', 'dev', 'emoji', `${setKey}-debug-report.json`);
    fs.writeFileSync(debugPath, JSON.stringify(debug, null, 2), 'utf-8');

    // --- Sensa Mapping Helper ---
    /**
     * Maps Unicode codepoints (and skin tone variants) to Sensa asset filenames.
     * Only includes hand-related emoji (group: 'People & Body', subgroup includes 'hand') and their skin tone variants.
     * Uses emojiBase for codepoints and names, and only includes files that exist in the Sensa asset directory.
     * Returns a mapping: codepoint -> { assetPath }
     */
    function buildSensaMapAssetDriven(emojiBase: any, files: string[], setInfo: any) {
      // Helper: Map Sensa skin number to Unicode skin tone
      const SKIN_TONE_MAP_REV: Record<number, string> = {
        1: '1F3FB', // light
        2: '1F3FC', // medium-light
        3: '1F3FD', // medium
        4: '1F3FE', // medium-dark
        5: '1F3FF', // dark
      };
      // Helper to normalize names for matching
      function normalizeName(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, ' ').trim();
      }
      // Build a lookup of emojiBase by normalized name and skin tone
      const baseLookup: Record<string, Record<string, string>> = {}; // name -> skin_tone -> codepoint
      for (const code in emojiBase) {
        const meta = emojiBase[code];
        if (meta.group === 'People & Body' && meta.subgroup && meta.subgroup.includes('hand')) {
          let baseName = meta.name.replace(/E[0-9.]+ /, '').replace(/:.*$/, '').trim();
          let norm = normalizeName(baseName);
          let skin = 'default';
          if (code.includes('-1F3F')) {
            const parts = code.split('-');
            skin = parts[parts.length - 1];
          }
          if (!baseLookup[norm]) baseLookup[norm] = {};
          baseLookup[norm][skin] = code;
        }
      }
      // Now process each Sensa asset file
      const map: Record<string, { assetPath: string }> = {};
      const manualAssignments: { key: string, file: string }[] = [];
      let manualCount = 1;
      for (const file of files) {
        if (!file.endsWith('.svg')) continue;
        let name = file.replace(/\.svg$/, '');
        let norm = normalizeName(name.replace(/ skin [1-5]$/, ''));
        // Detect skin tone
        let skinMatch = name.match(/ skin ([1-5])$/);
        let skin = 'default';
        if (skinMatch) {
          const num = parseInt(skinMatch[1], 10);
          skin = SKIN_TONE_MAP_REV[num] || 'default';
        }
        // Try to find a matching codepoint
        let code = baseLookup[norm] && baseLookup[norm][skin];
        if (!code && skin !== 'default' && baseLookup[norm]) {
          // Fallback: try default if specific skin not found
          code = baseLookup[norm]['default'];
        }
        if (code) {
          map[code] = { assetPath: setInfo.assetPath(name) };
        } else {
          // No match: assign manual key
          const manualKey = `manual${manualCount++}`;
          map[manualKey] = { assetPath: setInfo.assetPath(name) };
          manualAssignments.push({ key: manualKey, file: name });
        }
      }
      return { map, manualAssignments };
    }

    if (setKey === 'sensamoji') {
      // Use the new asset-driven mapping logic for Sensa
      const { map: sensaMap, manualAssignments } = buildSensaMapAssetDriven(emojiBase, files, setInfo);
      // Save debug info for manual assignments
      debug.manualAssignments = manualAssignments;
      fs.writeFileSync(debugPath, JSON.stringify(debug, null, 2), 'utf-8');
      // Write map
      const outPath = path.join(process.cwd(), 'public', 'dev', 'emoji', `emoji-${setKey}.json`);
      fs.writeFileSync(outPath, JSON.stringify(sensaMap, null, 2), 'utf-8');
      return res.status(200).json({ success: true, data: { set, count: Object.keys(sensaMap).length, debugReport: `${setKey}-debug-report.json`, debug } });
    } else {
      for (const code in emojiBase) {
        const fileName = setInfo.filename(code);
        if (files.includes(fileName)) {
          map[code] = { assetPath: setInfo.assetPath(code) };
        }
      }
      // Write to public/dev/emoji/[set].json
      const outPath = path.join(process.cwd(), 'public', 'dev', 'emoji', `emoji-${setKey}.json`);
      fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf-8');
      return res.status(200).json({ success: true, data: { set, count: Object.keys(map).length, debugReport: `${setKey}-debug-report.json`, debug } });
    }
  } catch (err: any) {
    handleApiError(res, err.message || 'Internal server error', 'INTERNAL_ERROR', 500, '/api/dev/emoji/build-emoji-set-map');
  }
} 