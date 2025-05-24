import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';

// Type for a report entry
interface ReportEntry {
  filePath: string;
  lines: number;
  size: number;
  mtime: string;
}

// Utility to fetch the latest report
async function fetchReport(): Promise<ReportEntry[]> {
  const res = await fetch('/dev/code-report.json');
  if (!res.ok) throw new Error('Could not load report');
  return res.json();
}

// Utility to format the date stamp
function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today';
  }
  return date.toLocaleDateString();
}

// Utility to get file extension
function getFileType(filePath: string): string {
  const match = filePath.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

// Utility to format file size in KB
function formatKB(bytes: number | undefined): string {
  if (typeof bytes !== 'number' || isNaN(bytes)) return 'N/A';
  return (bytes / 1024).toFixed(1);
}

const CodeReportPage: React.FC = () => {
  const [report, setReport] = useState<ReportEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastGenerated, setLastGenerated] = useState<string>('');
  const [sortCol, setSortCol] = useState<'filePath' | 'type' | 'lines' | 'size' | 'mtime'>('filePath');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [lineFilter, setLineFilter] = useState<string>('0');
  const [lineFilterOp, setLineFilterOp] = useState<'>' | '<'>('>');
  const [dirFilter, setDirFilter] = useState<string>('All');

  // Load the report on mount
  useEffect(() => {
    fetchReport()
      .then((data) => {
        setReport(data);
        setLastGenerated(new Date().toISOString());
      })
      .catch(() => setReport(null));
  }, []);

  // Handler to trigger report generation
  const handleBuildReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dev/generate-code-report', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setLastGenerated(new Date().toISOString());
      // Fetch the new report
      const newReport = await fetchReport();
      setReport(newReport);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sorting logic
  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const getSortArrow = (col: typeof sortCol) => {
    if (sortCol !== col) return '';
    return sortDir === 'asc' ? '▲' : '▼';
  };

  // Get top-level directories from file paths
  let topDirs: string[] = [];
  const hasData = Array.isArray(report) && report.length > 0;
  const dataStamp = formatDate(lastGenerated);
  if (hasData && report) {
    const dirs = new Set<string>();
    report.forEach(file => {
      const parts = file.filePath.split(/[\\/]/);
      if (parts.length > 1) dirs.add(parts[0]);
    });
    topDirs = Array.from(dirs).sort();
  }

  // Filtering logic
  let filteredReport = report;
  if (hasData && lineFilter !== '' && !isNaN(Number(lineFilter)) && report) {
    filteredReport = report.filter(file =>
      lineFilterOp === '>'
        ? file.lines > Number(lineFilter)
        : file.lines < Number(lineFilter)
    );
  }
  if (hasData && dirFilter !== 'All' && filteredReport) {
    filteredReport = filteredReport.filter(file => file.filePath.startsWith(dirFilter + '/'));
  }

  // Sort the filtered report data
  let sortedReport = filteredReport;
  if (hasData && filteredReport) {
    sortedReport = [...filteredReport].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortCol === 'filePath') {
        aVal = a.filePath.toLowerCase();
        bVal = b.filePath.toLowerCase();
      } else if (sortCol === 'type') {
        aVal = getFileType(a.filePath);
        bVal = getFileType(b.filePath);
      } else if (sortCol === 'lines') {
        aVal = a.lines;
        bVal = b.lines;
      } else if (sortCol === 'size') {
        aVal = a.size;
        bVal = b.size;
      } else if (sortCol === 'mtime') {
        aVal = a.mtime;
        bVal = b.mtime;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Totals for current filter
  const totalFiles = sortedReport && sortedReport.length ? sortedReport.length : 0;
  const totalLines = sortedReport && sortedReport.length ? sortedReport.reduce((sum, f) => sum + f.lines, 0) : 0;

  // Dev-only warning
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <div className="alert alert-warning shadow-lg">
          <span>This tool is only available in development mode.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Menu Bar */}
      <nav className="w-full fixed top-0 left-0 bg-base-200 border-b border-base-300 z-50 flex items-center justify-center h-14 shadow-sm">
        <div className="flex gap-6">
          <Link href="/dev" legacyBehavior>
            <a className="btn btn-ghost app-btn-base">Dev Console</a>
          </Link>
          <Link href="/test" legacyBehavior>
            <a className="btn btn-ghost app-btn-base">Test Home</a>
          </Link>
        </div>
      </nav>
      {/* Main Content (with padding for menu bar) */}
      <main className="min-h-screen bg-base-100 flex flex-col items-center p-4 pt-16">
        <div className="w-full max-w-4xl flex flex-col gap-2">
          {/* Header Card */}
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h1 className="app-section-header-base text-lg mb-1">System Code Line Count Report</h1>
              <div className="text-sm text-gray-500 mb-1">Last generated: {dataStamp || 'N/A'}</div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  className="btn btn-primary btn-xs app-btn-base"
                  onClick={handleBuildReport}
                  disabled={loading}
                  aria-label="Build Report"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" aria-label="Loading"></span>
                  ) : (
                    'Build Report'
                  )}
                </button>
                {error && <span className="text-error ml-2">{error}</span>}
              </div>
              {/* Totals summary */}
              <div className="mb-1 text-sm text-gray-700" aria-live="polite">
                <span className="font-semibold">Total files:</span> {totalFiles} &nbsp;|&nbsp; <span className="font-semibold">Total lines:</span> {totalLines}
              </div>
              {/* Filter UI */}
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <label className="font-medium" htmlFor="dirFilter">Directory:</label>
                <select
                  id="dirFilter"
                  className="select select-bordered app-select-base"
                  value={dirFilter}
                  onChange={e => setDirFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {topDirs.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
                <label className="font-medium" htmlFor="lineFilterOp">Lines:</label>
                <select
                  id="lineFilterOp"
                  className="select select-bordered app-select-base w-16"
                  value={lineFilterOp}
                  onChange={e => setLineFilterOp(e.target.value as '>' | '<')}
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                </select>
                <input
                  type="number"
                  className="input input-bordered app-input-base w-16 text-sm"
                  value={lineFilter}
                  onChange={e => setLineFilter(e.target.value)}
                  min={0}
                  aria-label="Line count filter"
                />
              </div>
            </div>
          </div>
          {/* Table Card */}
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table app-table-base text-xs">
                  <thead>
                    <tr>
                      <th className="app-table-header-base cursor-pointer px-2 py-1" onClick={() => handleSort('filePath')}>File {getSortArrow('filePath')}</th>
                      <th className="app-table-header-base cursor-pointer px-2 py-1" onClick={() => handleSort('type')}>Type {getSortArrow('type')}</th>
                      <th className="app-table-header-base cursor-pointer px-2 py-1" onClick={() => handleSort('lines')}>Lines {getSortArrow('lines')}</th>
                      <th className="app-table-header-base cursor-pointer px-2 py-1" onClick={() => handleSort('size')}>KB {getSortArrow('size')}</th>
                      <th className="app-table-header-base cursor-pointer px-2 py-1" onClick={() => handleSort('mtime')}>Modified {getSortArrow('mtime')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReport && sortedReport.length > 0 ? (
                      sortedReport.map((file, idx) => (
                        <tr key={file.filePath + idx} className="app-table-row-base">
                          <td className="app-table-cell-base px-2 py-1 text-xs">{file.filePath}</td>
                          <td className="app-table-cell-base px-2 py-1 text-xs">{getFileType(file.filePath)}</td>
                          <td className="app-table-cell-base px-2 py-1 text-xs">{file.lines}</td>
                          <td className="app-table-cell-base px-2 py-1 text-xs">{formatKB(file.size)}</td>
                          <td className="app-table-cell-base px-2 py-1 text-xs">{formatDate(file.mtime)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="app-table-cell-base px-2 py-1 text-xs" colSpan={5}>No data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CodeReportPage; 