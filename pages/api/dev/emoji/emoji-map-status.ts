import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { handleApiError } from '../../../../utils/apiError';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { set } = req.query;
  if (!set || typeof set !== 'string') {
    return handleApiError(res, 'Missing set key', 'MISSING_SET_KEY', 400, '/api/dev/emoji/emoji-map-status');
  }
  const mapPath = path.join(process.cwd(), 'public', 'dev', 'emoji', `emoji-${set}.json`);
  if (!fs.existsSync(mapPath)) {
    return res.status(200).json({ success: true, data: { exists: false, size: 0, date: null } });
  }
  const raw = fs.readFileSync(mapPath, 'utf-8');
  let size = 0;
  try {
    const json = JSON.parse(raw);
    size = Object.keys(json).length;
  } catch {
    size = 0;
  }
  const stat = fs.statSync(mapPath);
  const date = new Date(stat.mtime).toISOString().slice(0, 10);
  return res.status(200).json({ success: true, data: { exists: true, size, date } });
} 