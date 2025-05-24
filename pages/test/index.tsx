import React from 'react';
import Link from 'next/link';

/**
 * Test Index Page
 * - Lists all test pages as cards
 * - Uses .app-card-base and DaisyUI for styling
 * - Easily extensible for more tests
 * - Includes a top menu bar for navigation between /dev and /test
 */

const tests = [
  {
    title: 'UI Demo',
    description: 'Showcase of all core UI components and theme picker.',
    href: '/test/ui-demo',
  },
  // Add more tests here as needed
];

export default function TestIndex() {
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
      <main className="min-h-screen flex flex-col items-center bg-base-100 p-4 pt-16">
        <h1 className="app-section-header-base text-lg text-center mb-2">Test Pages</h1>
        <div className="max-w-xl w-full flex flex-col gap-2">
          {tests.map((test) => (
            <div key={test.href} className="card app-card-base bg-base-200 w-80 mx-auto">
              <div className="card-body flex flex-col items-center">
                <h2 className="app-section-header-base text-lg text-center mb-1">{test.title}</h2>
                <p className="text-sm text-center mb-1">{test.description}</p>
                <div className="flex w-full justify-end">
                  <Link href={test.href} legacyBehavior>
                    <a className="btn btn-primary app-btn-base">UI Test</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
} 