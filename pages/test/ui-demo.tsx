import React, { useState } from 'react';
import Link from 'next/link';

/**
 * UI Demo Page
 * - Showcases each core UI component styled per AllSpark UI spec 
 * - Includes DaisyUI theme picker
 * - Demonstrates .app-*-base + DaisyUI class usage
 */

const themes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
];

export default function UIDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Update theme on <html> element
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
      <main className="min-h-screen bg-base-100 p-4 flex flex-col items-center pt-16">
        {/* Theme Picker */}
        <section className="w-full max-w-2xl mb-8">
          <label className="app-section-header-base block">Theme Picker</label>
          <select
            className="select select-bordered app-select-base"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            aria-label="Select theme"
          >
            {themes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </section>

        {/* Section Header */}
        <section className="w-full max-w-2xl mb-6">
          <div className="app-section-header-base">Section Header Example</div>
        </section>

        {/* Button */}
        <section className="w-full max-w-2xl mb-6">
          {/* DaisyUI btn + .app-btn-base */}
          <button className="btn btn-primary app-btn-base">Primary Button</button>
          <button className="btn btn-secondary app-btn-base ml-2">Secondary Button</button>
        </section>

        {/* Input, Select, Textarea */}
        <section className="w-full max-w-2xl mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input input-bordered app-input-base" placeholder="Input" aria-label="Sample input" />
          <select className="select select-bordered app-select-base" aria-label="Sample select">
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          <textarea className="textarea textarea-bordered app-textarea-base" placeholder="Textarea" aria-label="Sample textarea" />
        </section>

        {/* Card */}
        <section className="w-full max-w-2xl mb-6">
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Card Title</h2>
              <p>This is a sample card using DaisyUI and .app-card-base.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary app-btn-base">Action</button>
              </div>
            </div>
          </div>
        </section>

        {/* Badge */}
        <section className="w-full max-w-2xl mb-6 flex gap-2">
          <span className="badge badge-primary app-badge-base">Primary Badge</span>
          <span className="badge badge-secondary app-badge-base">Secondary Badge</span>
          <span className="badge badge-accent app-badge-base">Accent Badge</span>
        </section>

        {/* Table */}
        <section className="w-full max-w-2xl mb-6 overflow-x-auto">
          <table className="table app-table-base">
            <thead>
              <tr>
                <th className="app-table-header-base">Name</th>
                <th className="app-table-header-base">Role</th>
                <th className="app-table-header-base">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="app-table-row-base">
                <td className="app-table-cell-base">Alice</td>
                <td className="app-table-cell-base">Admin</td>
                <td className="app-table-cell-base"><span className="badge badge-success app-badge-base">Active</span></td>
              </tr>
              <tr className="app-table-row-base">
                <td className="app-table-cell-base">Bob</td>
                <td className="app-table-cell-base">User</td>
                <td className="app-table-cell-base"><span className="badge badge-error app-badge-base">Inactive</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Modal Example */}
        <section className="w-full max-w-2xl mb-6">
          <button
            className="btn btn-accent app-btn-base"
            onClick={() => setModalOpen(true)}
          >
            Open Modal
          </button>
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-base-300/60 z-50">
              <div className="app-modal-base relative">
                <button
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                  aria-label="Close modal"
                  onClick={() => setModalOpen(false)}
                >✕</button>
                <h3 className="font-bold text-lg mb-2">Modal Title</h3>
                <p>This is a modal using .app-modal-base and DaisyUI.</p>
              </div>
            </div>
          )}
        </section>

        {/* Link Example */}
        <section className="w-full max-w-2xl mb-6">
          <a href="#" className="app-link-base">Sample Link (app-link-base)</a>
        </section>

        {/* Base Inputs: Radio, Toggle, Checkbox */}
        <section className="w-full max-w-2xl mb-6">
          <div className="app-section-header-base mb-2">Base Inputs</div>
          <form className="flex flex-col gap-4">
            {/* Radio Group */}
            <fieldset>
              <legend className="font-semibold mb-1">Radio Group</legend>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input type="radio" name="demo-radio" className="radio app-radio-base" defaultChecked />
                  <span>Option 1</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="demo-radio" className="radio app-radio-base" />
                  <span>Option 2</span>
                </label>
              </div>
            </fieldset>
            {/* Toggle */}
            <label className="flex items-center gap-2">
              <input type="checkbox" className="toggle app-toggle-base" />
              <span>Base Toggle</span>
            </label>
            {/* Checkbox */}
            <label className="flex items-center gap-2">
              <input type="checkbox" className="checkbox app-checkbox-base" defaultChecked />
              <span>Base Checkbox</span>
            </label>
          </form>
        </section>

        {/* Base Alerts, Progress, Label, Range, Tabs */}
        <section className="w-full max-w-2xl mb-6">
          <div className="app-section-header-base mb-2">Base Alerts, Progress, Label, Range, Tabs</div>
          {/* Alert */}
          <div className="alert alert-info app-alert-base mb-2">
            <span>This is an info alert using <code>app-alert-base</code>.</span>
          </div>
          {/* Progress Bar */}
          <label className="app-label-base block" htmlFor="demo-progress">Progress</label>
          <progress id="demo-progress" className="progress progress-primary app-progress-base mb-4" value={60} max={100}></progress>
          {/* Label + Input */}
          <div className="mb-4">
            <label className="app-label-base block" htmlFor="demo-input">Base Label for Input</label>
            <input id="demo-input" className="input input-bordered app-input-base" placeholder="Input with label" />
          </div>
          {/* Range Slider */}
          <div className="mb-4">
            <label className="app-label-base block" htmlFor="demo-range">Range Slider</label>
            <input id="demo-range" type="range" className="range app-range-slider-base" min={0} max={100} defaultValue={50} />
          </div>
          {/* Tabs */}
          <div className="tabs mt-4">
            <a className="tab tab-bordered app-tab-base tab-active">Tab 1</a>
            <a className="tab tab-bordered app-tab-base">Tab 2</a>
            <a className="tab tab-bordered app-tab-base">Tab 3</a>
          </div>
        </section>

        {/* Thin Range Slider Demo */}
        <section className="w-full max-w-2xl mb-6">
          <div className="app-section-header-base mb-2">Thin Range Slider (Base + DaisyUI)</div>
          {/* Always pair .app-range-slider-thin-base with DaisyUI's range-sm for a thin, consistent slider */}
          <label className="app-label-base block" htmlFor="demo-thin-range">Thin Range Slider</label>
          <input
            id="demo-thin-range"
            type="range"
            min={0}
            max={100}
            defaultValue={50}
            className="range app-range-slider-base [--range-fill:0]"

          />
        </section>
      </main>
    </>
  );
} 