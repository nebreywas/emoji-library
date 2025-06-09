import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { set } = req.query;
  if (!set || typeof set !== 'string') {
    return res.status(400).json({ error: 'Missing set key' });
  }
  const mapPath = path.join(process.cwd(), 'public', 'dev', `emoji-${set}.json`);
  if (!fs.existsSync(mapPath)) {
    return res.status(200).json({ exists: false, size: 0, date: null });
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
  return res.status(200).json({ exists: true, size, date });
} 