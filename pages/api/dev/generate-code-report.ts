import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { handleApiError, wrapApiHandler } from '../../../utils/apiError';

// Type for a report entry
interface ReportEntry {
  filePath: string;
  lines: number;
  size: number;
  mtime: string;
}

// Helper to recursively collect all files with approved extensions
async function collectFiles(dir: string, exts: string[]): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await collectFiles(fullPath, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Helper to count lines in a file
async function countLines(filePath: string): Promise<number> {
  const content = await fs.readFile(filePath, 'utf-8');
  // Split on newlines, count non-empty lines
  return content.split(/\r?\n/).length;
}

// API route to generate a simple line count report
export async function generateCodeReportHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const location = '/api/dev/emoji/generate-code-report';
  if (req.method !== 'POST') {
    return handleApiError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405, location);
  }
  if (process.env.NODE_ENV !== 'development') {
    return handleApiError(res, 'This tool is only available in development mode.', 'FORBIDDEN', 403, location);
  }
  try {
    const configPath = path.join(process.cwd(), 'config', 'file-analysis-settings.json');
    const configRaw = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configRaw);
    const include: string[] = config.include || [];
    const exclude: string[] = config.exclude || [];
    // Approved extensions (now includes .json)
    const exts = ['.js', '.jsx', '.ts', '.tsx', '.html', '.htm', '.ejs', '.json'];

    let files: string[] = [];
    for (const dir of include) {
      const absDir = path.join(process.cwd(), dir);
      try {
        const stat = await fs.stat(absDir);
        if (stat.isDirectory()) {
          files = files.concat(await collectFiles(absDir, exts));
        } else if (stat.isFile() && exts.some(ext => absDir.endsWith(ext))) {
          files.push(absDir);
        }
      } catch (e) {
        // Ignore missing directories/files
      }
    }

    // Filter out excluded files (by relative path)
    const filteredFiles = files.filter(file => {
      const relPath = path.relative(process.cwd(), file);
      return !exclude.includes(relPath);
    });

    if (filteredFiles.length === 0) {
      throw new Error('No matching files found to analyze. Check your config include/exclude paths.');
    }

    // Count lines, get size, and mtime for each file
    const report: ReportEntry[] = [];
    for (const file of filteredFiles) {
      const relPath = path.relative(process.cwd(), file);
      const lines = await countLines(file);
      const stat = await fs.stat(file);
      report.push({
        filePath: relPath,
        lines,
        size: stat.size, // in bytes
        mtime: stat.mtime.toISOString(), // last modified date
      });
    }

    // Output path for the report
    const outputDir = path.join(process.cwd(), 'public', 'dev');
    const outputFile = path.join(outputDir, 'code-report.json');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify(report, null, 2), 'utf-8');

    res.status(200).json({
      error: false,
      data: {
        analyzedFiles: report.length,
        reportPath: '/dev/code-report.json',
        generatedAt: new Date().toISOString(),
      }
    });
  } catch (err: any) {
    console.error('[linecount] Error:', err && err.stack ? err.stack : err);
    handleApiError(res, err.message || err.toString(), err.code || 'INTERNAL_ERROR', 500, location);
  }
}

// Export the handler wrapped with the error handler
export default wrapApiHandler(generateCodeReportHandler, '/api/dev/emoji/generate-code-report'); 