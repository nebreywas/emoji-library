import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { getEmojiElement } from '../../lib/emoji';
import { EmojiEntry, EmojiSetMap, EmojiSystemConfig } from '../../lib/emoji/types';
import path from 'path';
import fs from 'fs';
import Link from 'next/link';
import { loadEmojiConfig } from '../../lib/emoji/config';

// List of supported sets (expand as more are enabled)
const EMOJI_SYSTEM_CONFIG = loadEmojiConfig();
const EMOJI_SETS = Object.entries(EMOJI_SYSTEM_CONFIG.sets).map(([id, config]) => ({
  id,
  name: config.name,
}));

// Helper to get sample emoji filenames (static for now, could be dynamic)
const SAMPLE_EMOJIS = [
  '1f600', // grinning face (Twemoji uses lowercase hex)
  '1f601',
  '1f602',
  '1f603',
  '1f604',
  '1f605',
  '1f606',
  '1f607',
  '1f608',
  '1f609',
];

const SENSA_EMOJIS = [
  "Clapping hands.svg",
  "Folded hands.svg",
  "Love you gesture.svg",
  "Handshake.svg",
  "Ok hand.svg"
];

interface EmojiAssetTestPageProps {
  emojiBase: Record<string, EmojiEntry>;
  config: EmojiSystemConfig;
  emojiSet: Record<string, EmojiSetMap>;
}

const EmojiAssetTestPage: React.FC<EmojiAssetTestPageProps> = ({ emojiBase, config, emojiSet }) => {
  // Effect toggles
  const [grayscale, setGrayscale] = useState(false);
  const [sepia, setSepia] = useState(0);

  // Compose filter string for emoji previews
  const filter = [
    grayscale ? 'grayscale(100%)' : '',
    sepia > 0 ? `sepia(${sepia}%)` : ''
  ].filter(Boolean).join(' ');

  // Example usages of getEmojiElement (now passing all required data)
  const emojiCharExample = getEmojiElement('😀', { size: 48 }, emojiBase, config, emojiSet);
  const emojiShortcodeExample = getEmojiElement(':umbrella:', { set: 'openmoji', size: 48 }, emojiBase, config, emojiSet);
  const emojiCodepointExample = getEmojiElement('1F44D', { set: 'twemoji', size: 48 }, emojiBase, config, emojiSet);

  return (
    <>
      {/* Top Menu Bar (DaisyUI + app-*-base classes) */}
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
        <div className="max-w-4xl w-full flex flex-col gap-6">
          <h1 className="app-section-header-base text-lg text-center mb-2">Emoji Asset Test Page</h1>
          <div className="card app-card-base bg-base-200 mb-4">
            <div className="card-body">
              <p>
                This page previews emoji assets from each installed set. Use it to verify downloads and rendering. More features coming as sets are enabled.
              </p>
              {/* Effect controls */}
              <div className="flex gap-6 items-center mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={grayscale} onChange={e => setGrayscale(e.target.checked)} className="checkbox checkbox-primary" />
                  Grayscale
                </label>
                <label className="flex items-center gap-2">
                  Sepia
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={sepia}
                    onChange={e => setSepia(Number(e.target.value))}
                    className="range range-primary"
                    style={{ width: 100 }}
                  />
                  <span style={{ width: 32, display: 'inline-block' }}>{sepia}%</span>
                </label>
              </div>
            </div>
          </div>

          {/* Emoji Display Utility Test */}
          <section className="card app-card-base bg-base-200 mb-4">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-2">Emoji Display Utility Test</h2>
              <div className="flex gap-8 items-center">
                <div className="text-center">
                  {/* Example: Unicode character */}
                  {emojiCharExample}
                  <div className="text-xs mt-1">Unicode: '😀'</div>
                </div>
                <div className="text-center">
                  {/* Example: Shortcode */}
                  {emojiShortcodeExample}
                  <div className="text-xs mt-1">Shortcode: ':umbrella:'</div>
                </div>
                <div className="text-center">
                  {/* Example: Codepoint */}
                  {emojiCodepointExample}
                  <div className="text-xs mt-1">Codepoint: '1F44D'</div>
                </div>
              </div>
            </div>
          </section>

          {/* Emoji Set Previews */}
          {EMOJI_SETS.map(set => (
            <section key={set.id} className="card app-card-base bg-base-200 mb-4">
              <div className="card-body">
                <h2 className="app-section-header-base text-lg mb-2">{set.name}</h2>
                <div className="flex gap-4 flex-wrap items-center">
                  {SAMPLE_EMOJIS.map(code => {
                    const setConfig = EMOJI_SYSTEM_CONFIG.sets[set.id];
                    const filename = setConfig.filename(code.replace(/_/g, '-'));
                    const src = setConfig.assetPath ? setConfig.assetPath(code.replace(/_/g, '-')) : `/${setConfig.assetDir}/${filename}`;
                    return (
                      <div key={filename} className="text-center">
                        <img
                          src={src}
                          alt={code}
                          style={{ width: 48, height: 48, background: '#fff', borderRadius: 8, border: '1px solid #eee', filter }}
                          className="shadow-sm"
                          onError={e => (e.currentTarget.style.opacity = '0.2')}
                        />
                        <div className="text-xs mt-1">{code}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}

          {/* Sensa Emoji Preview */}
          <section className="card app-card-base bg-base-200 mb-4">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-2">Sensa Emoji</h2>
              <div className="flex gap-4 flex-wrap items-center">
                {SENSA_EMOJIS.map(filename => (
                  <div key={filename} className="text-center">
                    <img
                      src={`/emoji/sensamoji/${filename}`}
                      alt={filename.replace('.svg', '')}
                      style={{ width: 48, height: 48, background: '#fff', borderRadius: 8, border: '1px solid #eee', filter }}
                      className="shadow-sm"
                      onError={e => (e.currentTarget.style.opacity = '0.2')}
                    />
                    <div className="text-xs mt-1">{filename.replace('.svg', '')}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Load emojiBase
  const emojiBasePath = path.resolve(process.cwd(), 'public', 'dev', 'emoji', 'emoji-base.json');
  const emojiBase: Record<string, EmojiEntry> = JSON.parse(fs.readFileSync(emojiBasePath, 'utf-8'));

  // Use imported config via loader
  const config = loadEmojiConfig();

  // Helper to strip functions from config for serialization
  function stripFunctions(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(stripFunctions);
    } else if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        if (typeof obj[key] !== 'function') {
          result[key] = stripFunctions(obj[key]);
        }
      }
      return result;
    }
    return obj;
  }

  // Create a JSON-safe config
  const safeConfig = stripFunctions(config);

  // Load set maps for active and fallback sets
  const setsToLoad = [config.activeSet, config.fallbackSet];
  const emojiSet: Record<string, EmojiSetMap> = {};
  for (const setName of setsToLoad) {
    try {
      const setPath = path.resolve(process.cwd(), 'public', 'emoji', setName, 'set-map.json');
      if (fs.existsSync(setPath)) {
        emojiSet[setName] = JSON.parse(fs.readFileSync(setPath, 'utf-8'));
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    props: {
      emojiBase,
      config: safeConfig,
      emojiSet,
    },
  };
};

export default EmojiAssetTestPage; 