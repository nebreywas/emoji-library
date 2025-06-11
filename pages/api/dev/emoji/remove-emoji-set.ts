import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const SUPPORTED_SETS = ['openmoji', 'twemoji']; // Expand as more sets are supported

/**
 * API route to remove an emoji set's asset folder.
 * Expects POST with { set: string }.
 * Deletes /public/emoji/[set]/ directory.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  const { set } = req.body;
  if (!set || !SUPPORTED_SETS.includes(set)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing set' });
  }
  try {
    const dir = path.join(process.cwd(), 'public', 'emoji', set);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      return res.status(200).json({ success: true, data: { message: `Removed ${set} assets.` } });
    } else {
      return res.status(404).json({ success: false, error: 'Set assets not found.' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
} 