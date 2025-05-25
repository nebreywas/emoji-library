import React, { useState } from 'react';
import Link from 'next/link';
import tinycolor from 'tinycolor2';

// Helper to parse RGB input string (e.g., "255,0,0")
function parseRgbInput(input: string): string | null {
  const parts = input.split(',').map((p) => p.trim());
  if (parts.length !== 3) return null;
  const [r, g, b] = parts.map(Number);
  if ([r, g, b].some((v) => isNaN(v) || v < 0 || v > 255)) return null;
  return `rgb(${r},${g},${b})`;
}

// TinyColorTestCard component demonstrates TinyColor's color manipulation features
const baseColor = '#3498db'; // You can change this to test other base colors

export default function TinyColorTestCard() {
  // State for each input field
  const [colorName, setColorName] = useState('');
  const [hex, setHex] = useState('');
  const [rgb, setRgb] = useState('');

  // Determine which input to use (priority: RGB > Hex > Name > default)
  let inputColor = '#3498db';
  let inputLabel = 'Default (#3498db)';
  let error = '';

  if (rgb) {
    const rgbString = parseRgbInput(rgb);
    if (rgbString && tinycolor(rgbString).isValid()) {
      inputColor = rgbString;
      inputLabel = `RGB: ${rgbString}`;
    } else {
      error = 'Invalid RGB value.';
    }
  } else if (hex) {
    if (tinycolor(hex).isValid()) {
      inputColor = hex;
      inputLabel = `Hex: ${hex}`;
    } else {
      error = 'Invalid hex code.';
    }
  } else if (colorName) {
    if (tinycolor(colorName).isValid()) {
      inputColor = colorName;
      inputLabel = `Name: ${colorName}`;
    } else {
      error = 'Invalid color name.';
    }
  }

  // Generate color variations using TinyColor
  const variations = [
    { label: 'Original', color: inputColor },
    { label: 'Lighten 20%', color: tinycolor(inputColor).lighten(20).toString() },
    { label: 'Darken 20%', color: tinycolor(inputColor).darken(20).toString() },
    { label: 'Saturate 20%', color: tinycolor(inputColor).saturate(20).toString() },
    { label: 'Desaturate 20%', color: tinycolor(inputColor).desaturate(20).toString() },
    { label: 'Greyscale', color: tinycolor(inputColor).greyscale().toString() },
    { label: 'Complement', color: tinycolor(inputColor).complement().toString() },
  ];

  return (
    <>
      {/* Top Menu Bar (copied from test index) */}
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
        <div style={{ fontFamily: 'sans-serif', width: '100%', maxWidth: 600 }}>
          {/* Title and description */}
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>TinyColor Testcard</h1>
          <p style={{ marginBottom: 16 }}>
            This page demonstrates <code>tinycolor2</code> color manipulation. Enter a color below to see variations.
          </p>
          {/* Interactive color input fields */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600 }}>Color Name</label>
              <input
                type="text"
                placeholder="e.g. red"
                value={colorName}
                onChange={(e) => { setColorName(e.target.value); setHex(''); setRgb(''); }}
                style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, width: 120 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600 }}>Hex Code</label>
              <input
                type="text"
                placeholder="#3498db"
                value={hex}
                onChange={(e) => { setHex(e.target.value); setColorName(''); setRgb(''); }}
                style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, width: 120 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600 }}>RGB (r,g,b)</label>
              <input
                type="text"
                placeholder="52,152,219"
                value={rgb}
                onChange={(e) => { setRgb(e.target.value); setColorName(''); setHex(''); }}
                style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, width: 120 }}
              />
            </div>
          </div>
          {/* Show error if input is invalid */}
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          {/* Show which color is being used */}
          <div style={{ marginBottom: 16, fontWeight: 500 }}>
            Using: <span style={{ color: inputColor }}>{inputLabel}</span>
          </div>
          {/* Color variations table */}
          <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 500 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Variation</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Color</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {variations.map((v) => (
                <tr key={v.label}>
                  <td style={{ padding: 8 }}>{v.label}</td>
                  <td style={{ padding: 8 }}><code>{v.color}</code></td>
                  <td style={{ padding: 8 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 32,
                        height: 32,
                        background: v.color,
                        border: '1px solid #ccc',
                        borderRadius: 4,
                      }}
                      title={v.color}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Usage note */}
          <p style={{ marginTop: 32, color: '#888' }}>
            Enter a color name, hex code, or RGB value above. Only one field is used at a time (priority: RGB &gt; Hex &gt; Name).
          </p>
        </div>
      </main>
    </>
  );
} 