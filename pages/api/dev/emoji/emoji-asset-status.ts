import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { handleApiError } from '../../../../utils/apiError';

const EMOJI_ASSET_ROOT = path.join(process.cwd(), 'public', 'emoji');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { set } = req.query;
  if (!set || typeof set !== 'string') {
    return handleApiError(res, 'Missing set key', 'MISSING_SET_KEY', 400, '/api/dev/emoji/emoji-asset-status');
  }
  const dir = path.join(EMOJI_ASSET_ROOT, set);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return res.status(200).json({ success: true, data: { exists: false, fileCount: 0, files: [] } });
  }
  // List SVG and PNG files only
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg') || f.endsWith('.png'));
  return res.status(200).json({ success: true, data: { exists: true, fileCount: files.length, files } });
} 