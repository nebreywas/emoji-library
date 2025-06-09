import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import React, { useState } from 'react';

interface HomeProps {
  systemConfig: any;
  nextVersion: string;
  codeReportTotals: { totalFiles: number; totalLines: number };
}

/**
 * Dev Console page for internal development tools and reports.
 * Data is securely loaded on the server using getServerSideProps.
 * UI is fully compliant with AllSpark UI spec (DaisyUI + .app-*-base classes)
 */

const Home: React.FC<HomeProps> = ({ systemConfig, nextVersion, codeReportTotals }) => {
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
      {/* Page Content (with padding for menu bar) */}
      <main className="pt-16 min-h-screen bg-base-100 flex flex-col items-center p-4">
        <h1 className="app-section-header-base text-lg text-center mb-2">Dev Console</h1>
        <div className="max-w-xl w-full flex flex-col gap-2">
          {/* Version Report Card */}
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Version Report</h2>
              <div className="mb-1 text-sm">
                <span className="font-medium">Foundation Stack:</span>{' '}
                {/* Link to system.json, display stackVersion and lastUpdated */}
                {systemConfig && systemConfig.version ? (
                  <>
                    <a
                      href="#"
                      className="app-link-base cursor-default"
                      title="See config/system.json on server"
                    >
                      {systemConfig.version.stackVersion || systemConfig.version.version}
                    </a>{' '}
                    <span className="text-gray-500">({systemConfig.version.lastUpdated})</span>
                  </>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
              <div className="mb-1 text-sm">
                <span className="font-medium">NextJS version:</span>{' '}
                {nextVersion ? (
                  <span>{nextVersion.replace('^', '')}</span>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
              <div className="flex justify-end">
                <Link href="/dev/versionreport" legacyBehavior>
                  <a className="btn btn-primary app-btn-base">Full Report</a>
                </Link>
              </div>
            </div>
          </div>
          {/* Code Report Preview Card */}
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Code Line Count Report</h2>
              <div className="mb-1 text-sm">
                <span className="font-medium">Total files:</span> {codeReportTotals.totalFiles} &nbsp;|&nbsp;
                <span className="font-medium">Total lines:</span> {codeReportTotals.totalLines}
              </div>
              <div className="flex justify-end">
                <Link href="/dev/code-report" legacyBehavior>
                  <a className="btn btn-primary app-btn-base">Full Report</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Emoji Dev Panel Link Card */}
        <div className="max-w-xl w-full flex flex-col gap-2 mt-4">
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Emoji Asset & Config Tools</h2>
              <p className="text-sm mb-2">Manage emoji assets, build metadata, and more.</p>
              <a href="/dev/emoji-assets" className="btn btn-primary app-btn-base">Go to Emoji Asset Tools</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

// Server-side data fetching for security
export async function getServerSideProps() {
  // Read system.json
  let systemConfig = null;
  let nextVersion = '';
  let codeReportTotals = { totalFiles: 0, totalLines: 0 };
  try {
    const configPath = path.join(process.cwd(), 'config', 'system.json');
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    const configJson = JSON.parse(configRaw);
    systemConfig = configJson['system-settings'];
  } catch (e) {
    // Handle error or leave as null
  }
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf-8');
    const pkgJson = JSON.parse(pkgRaw);
    nextVersion = pkgJson.dependencies.next || '';
  } catch (e) {
    // Handle error or leave as empty
  }
  // Read code-report.json for totals
  try {
    const reportPath = path.join(process.cwd(), 'public', 'dev', 'code-report.json');
    const reportRaw = fs.readFileSync(reportPath, 'utf-8');
    const report = JSON.parse(reportRaw);
    codeReportTotals.totalFiles = Array.isArray(report) ? report.length : 0;
    codeReportTotals.totalLines = Array.isArray(report) ? report.reduce((sum, f) => sum + (f.lines || 0), 0) : 0;
  } catch (e) {
    // If missing, leave as 0
  }
  return {
    props: {
      systemConfig,
      nextVersion,
      codeReportTotals,
    },
  };
} 