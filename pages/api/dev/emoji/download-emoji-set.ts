import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import AdmZip, { IZipEntry } from 'adm-zip';

// Supported sets for validation
const SUPPORTED_SETS = ['openmoji', 'twemoji']; // Only OpenMoji and Twemoji for now

// OpenMoji release info
// Define the OpenMoji version and the URL for downloading the SVG files
const OPENMOJI_VERSION = '15.1.0';
// The URL points to the OpenMoji release on GitHub, specifically for SVG color files
const OPENMOJI_ZIP_URL = `https://github.com/hfg-gmuend/openmoji/releases/download/${OPENMOJI_VERSION}/openmoji-svg-color.zip`;

// Twemoji release info
const TWEMOJI_VERSION = '14.0.2';
const TWEMOJI_ZIP_URL = `https://github.com/twitter/twemoji/releases/download/v${TWEMOJI_VERSION}/72x72.zip`;

/**
 * Downloads and extracts OpenMoji SVG color assets to /public/emoji/openmoji/svg/color/
 */
async function downloadAndExtractOpenMoji(): Promise<{ success: boolean; error?: string }> {
  try {
    // Download the zip file
    const res = await fetch(OPENMOJI_ZIP_URL);
    if (!res.ok) {
      return { success: false, error: `Failed to download OpenMoji: ${res.statusText}` };
    }
    const buffer = await res.buffer();
    // Load zip
    const zip = new AdmZip(buffer);
    // Find all svg files in the zip (regardless of subdirectory)
    const entries = zip.getEntries().filter((e: IZipEntry) =>
      e.entryName.endsWith('.svg')
    );
    if (entries.length === 0) {
      return { success: false, error: 'No SVG color assets found in OpenMoji zip.' };
    }
    // Ensure output directory exists
    const outDir = path.join(process.cwd(), 'public', 'emoji', 'openmoji', 'svg', 'color');
    fs.mkdirSync(outDir, { recursive: true });
    // Extract each file
    for (const entry of entries) {
      const outPath = path.join(outDir, path.basename(entry.entryName));
      fs.writeFileSync(outPath, entry.getData());
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Downloads and extracts Twemoji PNG assets to /public/emoji/twemoji/png/
 */
async function downloadAndExtractTwemoji(): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(TWEMOJI_ZIP_URL);
    if (!res.ok) {
      return { success: false, error: `Failed to download Twemoji: ${res.statusText}` };
    }
    const buffer = await res.buffer();
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries().filter((e: IZipEntry) => e.entryName.endsWith('.png'));
    if (entries.length === 0) {
      return { success: false, error: 'No PNG assets found in Twemoji zip.' };
    }
    const outDir = path.join(process.cwd(), 'public', 'emoji', 'twemoji', 'png');
    fs.mkdirSync(outDir, { recursive: true });
    for (const entry of entries) {
      const outPath = path.join(outDir, path.basename(entry.entryName));
      fs.writeFileSync(outPath, entry.getData());
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * API route to download and install emoji asset sets.
 * Expects POST with { sets: string[] }.
 * Returns status/progress/errors.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { sets } = req.body;
    if (!Array.isArray(sets) || sets.some((s) => !SUPPORTED_SETS.includes(s))) {
      return res.status(400).json({ error: 'Invalid or missing sets' });
    }

    // Handle OpenMoji
    if (sets.includes('openmoji')) {
      const result = await downloadAndExtractOpenMoji();
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
    }
    // Handle Twemoji
    if (sets.includes('twemoji')) {
      const result = await downloadAndExtractTwemoji();
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
    }
    return res.status(200).json({ status: 'Selected sets downloaded and extracted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
} 