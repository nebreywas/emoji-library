import React from 'react';

/**
 * Main Index Page
 * - Shows a centered card with a welcome message
 * - Uses DaisyUI card + .app-card-base for styling
 * - Vertically and horizontally centers content
 */

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card app-card-base bg-base-200">
        <div className="card-body flex items-center justify-center">
          <h1 className="text-2xl font-bold text-center">Welcome to AllSpark</h1>
          <p className="text-lg text-center">Root Framework</p>
        </div>
      </div>
    </main>
  );
}