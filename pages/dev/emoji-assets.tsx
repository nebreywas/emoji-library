import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import { loadEmojiConfig } from '../../lib/emoji/config';

// Add this at the top of the file for TypeScript global augmentation
declare global {
  interface Window {
    emojiSetMaps?: Record<string, any>;
  }
}

// Supported emoji sets and their display names
const EMOJI_SYSTEM_CONFIG = loadEmojiConfig();
const EMOJI_SETS_LIST = Object.entries(EMOJI_SYSTEM_CONFIG.sets).map(([id, config]) => ({
  id,
  name: config.name,
}));

// Only OpenMoji and Twemoji are enabled for now
const ENABLED_SETS = ['openmoji', 'twemoji'];

/**
 * Dev-only page for downloading and installing emoji asset sets.
 * This UI lets you select sets, trigger download, remove sets, and view progress/errors.
 */
const EmojiAssetsDevPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [showTwemojiInstructions, setShowTwemojiInstructions] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  // State for installed status and file count per set
  const [assetStatus, setAssetStatus] = useState<Record<string, { loading: boolean, exists: boolean, fileCount: number }>>({});
  const [mapStatus, setMapStatus] = useState<Record<string, { loading: boolean, exists: boolean, size: number, date: string | null }>>({});
  const [mapCreating, setMapCreating] = useState<Record<string, boolean>>({});
  const [mapError, setMapError] = useState<Record<string, string | null>>({});
  const [installModal, setInstallModal] = useState<{ setId: string, open: boolean } | null>(null);

  useEffect(() => {
    EMOJI_SETS_LIST.forEach(set => {
      setAssetStatus(prev => ({ ...prev, [set.id]: { loading: true, exists: false, fileCount: 0 } }));
      fetch(`/api/dev/emoji/emoji-asset-status?set=${set.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            setAssetStatus(prev => ({ ...prev, [set.id]: { loading: false, exists: false, fileCount: 0 } }));
          } else {
            setAssetStatus(prev => ({ ...prev, [set.id]: { loading: false, exists: data.data.exists, fileCount: data.data.fileCount } }));
          }
        })
        .catch(() => {
          setAssetStatus(prev => ({ ...prev, [set.id]: { loading: false, exists: false, fileCount: 0 } }));
        });
      // Fetch map status
      setMapStatus(prev => ({ ...prev, [set.id]: { loading: true, exists: false, size: 0, date: null } }));
      fetch(`/api/dev/emoji/emoji-map-status?set=${set.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            setMapStatus(prev => ({ ...prev, [set.id]: { loading: false, exists: false, size: 0, date: null } }));
          } else {
            setMapStatus(prev => ({ ...prev, [set.id]: { loading: false, exists: data.data.exists, size: data.data.size, date: data.data.date } }));
          }
        })
        .catch(() => {
          setMapStatus(prev => ({ ...prev, [set.id]: { loading: false, exists: false, size: 0, date: null } }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle set selection
  const toggleSet = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Call the API to download selected sets
  const handleDownload = async () => {
    setStatus('Downloading...');
    setError(null);
    try {
      const res = await fetch('/api/dev/emoji/download-emoji-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sets: selected }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Unknown error');
        setStatus('');
      } else {
        setStatus(data.data?.status || 'Download complete.');
      }
    } catch (err: any) {
      setError(err.message || String(err));
      setStatus('');
    }
  };

  // Remove a set's assets (with confirm for twemoji)
  const handleRemove = async (setKey: string) => {
    setRemoving(setKey);
    setStatus('');
    setError(null);
    try {
      const res = await fetch('/api/dev/emoji/remove-emoji-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ set: setKey }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Unknown error');
      } else {
        setStatus(data.data?.status || 'Set removed.');
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setRemoving(null);
      setConfirmRemove(null);
    }
  };

  const handleCreateMap = async (setKey: string) => {
    setMapCreating(prev => ({ ...prev, [setKey]: true }));
    setMapError(prev => ({ ...prev, [setKey]: null }));
    try {
      const res = await fetch(`/api/dev/emoji/build-emoji-set-map?set=${setKey}`, { method: 'POST' });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!data.success) {
        setMapError(prev => ({ ...prev, [setKey]: data.error || 'Error creating map (invalid response)' }));
      } else {
        // Refresh map status for this set
        setMapStatus(prev => ({ ...prev, [setKey]: { loading: true, exists: false, size: 0, date: null } }));
        fetch(`/api/dev/emoji/emoji-map-status?set=${setKey}`)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              setMapStatus(prev => ({ ...prev, [setKey]: { loading: false, exists: false, size: 0, date: null } }));
            } else {
              setMapStatus(prev => ({ ...prev, [setKey]: { loading: false, exists: data.data.exists, size: data.data.size, date: data.data.date } }));
            }
          })
          .catch(() => {
            setMapStatus(prev => ({ ...prev, [setKey]: { loading: false, exists: false, size: 0, date: null } }));
          });
      }
    } catch (err: any) {
      setMapError(prev => ({ ...prev, [setKey]: err.message || 'Error creating map (network or server error)' }));
    } finally {
      setMapCreating(prev => ({ ...prev, [setKey]: false }));
    }
  };

  return (
    <>
      {/* Top Menu Bar */}
      <nav className="w-full fixed top-0 left-0 bg-base-200 border-b border-base-300 z-50 flex items-center justify-center h-14 shadow-sm">
        <div className="flex gap-6">
          <a href="/dev" className="btn btn-ghost app-btn-base">Dev Console</a>
          <a href="/test" className="btn btn-ghost app-btn-base">Test Home</a>
        </div>
      </nav>
      {/* Page Content (with padding for menu bar) */}
      <main className="pt-16 min-h-screen bg-base-100 flex flex-col items-center p-4">
        <div className="max-w-4xl w-full flex flex-col gap-6">
          <h1 className="app-section-header-base text-lg text-center mb-2">Emoji Asset Management</h1>
          <div className="overflow-x-auto">
            <table className="app-table-base">
              <thead>
                <tr>
                  <th className="app-table-header-base">Set Name</th>
                  <th className="app-table-header-base">Installed?</th>
                  <th className="app-table-header-base">Create Map</th>
                  <th className="app-table-header-base">Map Size</th>
                  <th className="app-table-header-base">Map Date</th>
                  <th className="app-table-header-base">Remove?</th>
                  <th className="app-table-header-base">How to install</th>
                </tr>
              </thead>
              <tbody>
                {EMOJI_SETS_LIST.map(set => {
                  const status = assetStatus[set.id] || { loading: true, exists: false, fileCount: 0 };
                  return (
                    <tr key={set.id} className="app-table-row-base">
                      <td className="app-table-cell-base font-semibold">{set.name}</td>
                      <td className="app-table-cell-base">
                        {status.loading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : status.exists ? (
                          <span className="text-green-600 font-semibold">✅ {status.fileCount}</span>
                        ) : (
                          <span className="text-red-600 font-semibold">❌ Not installed</span>
                        )}
                      </td>
                      <td className="app-table-cell-base">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => handleCreateMap(set.id)}
                          disabled={mapCreating[set.id]}
                        >
                          {mapCreating[set.id] ? 'Creating...' : 'Create Map'}
                        </button>
                        {mapError[set.id] && (
                          <div className="text-xs text-error mt-1">{mapError[set.id]}</div>
                        )}
                      </td>
                      <td className="app-table-cell-base">
                        {mapStatus[set.id]?.loading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : mapStatus[set.id]?.exists ? (
                          <span className="text-green-600 font-semibold">{mapStatus[set.id].size}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="app-table-cell-base">
                        {mapStatus[set.id]?.loading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : mapStatus[set.id]?.exists && mapStatus[set.id].date ? (
                          <span>{mapStatus[set.id].date}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="app-table-cell-base"><button className="btn btn-error btn-xs">Remove</button></td>
                      <td className="app-table-cell-base">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => setInstallModal({ setId: set.id, open: true })}
                        >
                          How to install
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Existing cards and tools below the table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Build emoji-base.json</h2>
              <p className="text-sm mb-2">Downloads the latest Unicode emoji list and generates <code>emoji-base.json</code> for the system.</p>
              <EmojiBaseBuilder />
            </div>
          </div>
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Merge gemoji Shortcodes</h2>
              <p className="text-sm mb-2">Merges aliases, tags, and descriptions from gemoji into <code>emoji-base.json</code>.</p>
              <GemojiShortcodeMerger />
            </div>
          </div>
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Merge iamcal Shortcodes</h2>
              <p className="text-sm mb-2">Merges short_names, keywords, and category from iamcal/emoji-data into <code>emoji-base.json</code>.</p>
              <IamcalShortcodeMerger />
            </div>
          </div>
          <div className="card app-card-base bg-base-200">
            <div className="card-body">
              <h2 className="app-section-header-base text-lg mb-1">Add Skin Tone Field</h2>
              <p className="text-sm mb-2">Adds a <code>skin_tone</code> field to each emoji in <code>emoji-base.json</code> (default, light, medium-light, medium, medium-dark, dark).</p>
              <SkinToneAdder />
            </div>
          </div>
        </div>
        <div className="max-w-4xl w-full mt-8">
          <EmojiDbBrowser />
        </div>
      </main>
      {installModal && installModal.open && (
        <EmojiSetInstallModal
          open={installModal.open}
          onClose={() => setInstallModal(null)}
          setId={installModal.setId}
          setConf={EMOJI_SYSTEM_CONFIG.sets[installModal.setId]}
        />
      )}
    </>
  );
};

function EmojiBaseBuilder() {
  const [status, setStatus] = useState('');
  const [count, setCount] = useState<number|null>(null);
  const [lastModified, setLastModified] = useState<string|null>(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);

  // On mount, check if the file exists and get stats
  React.useEffect(() => {
    async function checkFile() {
      try {
        const res = await fetch('/dev/emoji/emoji-base.json');
        if (res.ok) {
          const json = await res.json();
          setCount(Object.keys(json).length);
          setExists(true);
          // Get last modified date via HEAD request
          const head = await fetch('/dev/emoji/emoji-base.json', { method: 'HEAD' });
          const date = head.headers.get('last-modified');
          setLastModified(date);
        } else {
          setExists(false);
        }
      } catch {
        setExists(false);
      }
    }
    checkFile();
  }, []);

  const handleBuild = async () => {
    setLoading(true);
    setStatus('Building...');
    setCount(null);
    try {
      const res = await fetch('/api/dev/emoji/build-emoji-base', { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setStatus(data.error || 'Error');
      } else {
        setStatus('Success!');
        setCount(data.data.count);
        setExists(true);
        setLastModified(new Date().toLocaleString());
      }
    } catch (err: any) {
      setStatus(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button className="btn btn-primary app-btn-base" onClick={handleBuild} disabled={loading}>
        {exists ? (loading ? 'Rebuilding...' : 'Rebuild emoji-base.json') : (loading ? 'Building...' : 'Build emoji-base.json')}
      </button>
      {exists && (
        <div className="mt-2 text-sm">
          <span className="font-medium">Current:</span> {count !== null ? `${count} emojis` : ''}
          {lastModified && <span> &middot; Last updated: {lastModified}</span>}
        </div>
      )}
      {status && (
        <div className="mt-2 text-sm">
          Status: {status} {count !== null && <span>({count} emojis)</span>}
        </div>
      )}
    </div>
  );
}

function GemojiShortcodeMerger() {
  const [status, setStatus] = useState('');
  const [updated, setUpdated] = useState<number|null>(null);
  const [total, setTotal] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  // Handles merging gemoji shortcodes, with robust error handling for API responses
  const handleMerge = async () => {
    setLoading(true);
    setStatus('Merging...');
    setUpdated(null);
    setTotal(null);
    try {
      const res = await fetch('/api/dev/emoji/merge-gemoji-shortcodes', { method: 'POST' });
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        // If response is not JSON, show a generic error
        setStatus('Error: Invalid server response');
        return;
      }
      // Standard: check HTTP status and error field
      if (!res.ok || !data.success) {
        setStatus(`Error: ${data?.error || res.statusText || 'Unknown error'}`);
        return;
      }
      // Only access data if present
      if (data && (typeof data.updated === 'number') && (typeof data.total === 'number')) {
        setStatus('Success!');
        setUpdated(data.updated);
        setTotal(data.total);
      } else if (data && data.data && (typeof data.data.updated === 'number') && (typeof data.data.total === 'number')) {
        // Backward compatibility: handle nested data
        setStatus('Success!');
        setUpdated(data.data.updated);
        setTotal(data.data.total);
      } else {
        setStatus('Success, but no update info returned.');
      }
    } catch (err: any) {
      setStatus(`Network or server error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button className="btn btn-primary app-btn-base" onClick={handleMerge} disabled={loading}>
        {loading ? 'Merging...' : 'Merge gemoji shortcodes'}
      </button>
      {status && (
        <div className="mt-2 text-sm">
          Status: {status} {updated !== null && total !== null && <span>({updated} updated / {total} total)</span>}
        </div>
      )}
    </div>
  );
}

function IamcalShortcodeMerger() {
  const [status, setStatus] = useState('');
  const [updated, setUpdated] = useState<number|null>(null);
  const [total, setTotal] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  // Handles merging iamcal shortcodes, with robust error handling for API responses
  const handleMerge = async () => {
    setLoading(true);
    setStatus('Merging...');
    setUpdated(null);
    setTotal(null);
    try {
      const res = await fetch('/api/dev/emoji/merge-iamcal-shortcodes', { method: 'POST' });
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setStatus('Error: Invalid server response');
        return;
      }
      if (!res.ok || !data.success) {
        setStatus(`Error: ${data?.error || res.statusText || 'Unknown error'}`);
        return;
      }
      if (data && (typeof data.updated === 'number') && (typeof data.total === 'number')) {
        setStatus('Success!');
        setUpdated(data.updated);
        setTotal(data.total);
      } else if (data && data.data && (typeof data.data.updated === 'number') && (typeof data.data.total === 'number')) {
        setStatus('Success!');
        setUpdated(data.data.updated);
        setTotal(data.data.total);
      } else {
        setStatus('Success, but no update info returned.');
      }
    } catch (err: any) {
      setStatus(`Network or server error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button className="btn btn-primary app-btn-base" onClick={handleMerge} disabled={loading}>
        {loading ? 'Merging...' : 'Merge iamcal shortcodes'}
      </button>
      {status && (
        <div className="mt-2 text-sm">
          Status: {status} {updated !== null && total !== null && <span>({updated} updated / {total} total)</span>}
        </div>
      )}
    </div>
  );
}

function SkinToneAdder() {
  const [status, setStatus] = useState('');
  const [updated, setUpdated] = useState<number|null>(null);
  const [total, setTotal] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  // Handles adding skin tone field, with robust error handling for API responses
  const handleAdd = async () => {
    setLoading(true);
    setStatus('Adding...');
    setUpdated(null);
    setTotal(null);
    try {
      const res = await fetch('/api/dev/emoji/add-skin-tone-field', { method: 'POST' });
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setStatus('Error: Invalid server response');
        return;
      }
      // Standard: check HTTP status and error field
      if (!res.ok || !data.success) {
        setStatus(`Error: ${data?.error || res.statusText || 'Unknown error'}`);
        return;
      }
      // Only access data if present
      if (data && (typeof data.updated === 'number') && (typeof data.total === 'number')) {
        setStatus('Success!');
        setUpdated(data.updated);
        setTotal(data.total);
      } else if (data && data.data && (typeof data.data.updated === 'number') && (typeof data.data.total === 'number')) {
        // Backward compatibility: handle nested data
        setStatus('Success!');
        setUpdated(data.data.updated);
        setTotal(data.data.total);
      } else {
        setStatus('Success, but no update info returned.');
      }
    } catch (err: any) {
      setStatus(`Network or server error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button className="btn btn-primary app-btn-base" onClick={handleAdd} disabled={loading}>
        {loading ? 'Adding...' : 'Add skin tone field'}
      </button>
      {status && (
        <div className="mt-2 text-sm">
          Status: {status} {updated !== null && total !== null && <span>({updated} updated / {total} total)</span>}
        </div>
      )}
    </div>
  );
}

function EmojiDbBrowser() {
  const [setKey, setSetKey] = useState('openmoji');
  const [emojiBase, setEmojiBase] = useState<any>(null);
  const [setMap, setSetMap] = useState<any>(null);
  const [emojiList, setEmojiList] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Load emoji-base and set map (skip map for native)
  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    if (setKey === 'native') {
      fetch('/dev/emoji/emoji-base.json').then(async r => {
        if (!r.ok) throw new Error('emoji-base.json not found');
        return r.json();
      }).then(base => {
        setEmojiBase(base);
        setSetMap(null);
        const codes = Object.keys(base);
        setEmojiList(codes);
        setIndex(0);
        setLoading(false);
      }).catch(err => {
        setLoading(false);
        setEmojiBase(null);
        setSetMap(null);
        setEmojiList([]);
        setIndex(0);
        setLoadError(err.message);
      });
    } else {
      Promise.all([
        fetch('/dev/emoji/emoji-base.json').then(async r => {
          if (!r.ok) throw new Error('emoji-base.json not found');
          return r.json();
        }),
        fetch(`/dev/emoji/emoji-${setKey}.json`).then(async r => {
          if (!r.ok) throw new Error(`emoji-${setKey}.json not found`);
          return r.json();
        })
      ]).then(([base, map]) => {
        setEmojiBase(base);
        setSetMap(map);
        const codes = Object.keys(base);
        setEmojiList(codes);
        setIndex(0);
        setLoading(false);
      }).catch(err => {
        setLoading(false);
        setEmojiBase(null);
        setSetMap(null);
        setEmojiList([]);
        setIndex(0);
        setLoadError(err.message);
      });
    }
  }, [setKey]);

  // Find emoji by shortcode or codepoint
  const jumpTo = (val: string) => {
    if (!emojiBase) return;
    const code = val.toUpperCase();
    // Try codepoint
    let idx = emojiList.indexOf(code);
    if (idx === -1) {
      // Try shortcode
      idx = emojiList.findIndex(c => (emojiBase[c].shortcodes || []).map((s: string) => s.toLowerCase()).includes(val.toLowerCase()));
    }
    if (idx !== -1) setIndex(idx);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (loadError) {
    if (loadError.includes('emoji-base.json')) {
      return <div className="text-center text-error">emoji-base.json not found. Please build it using the tool above.</div>;
    }
    if (loadError.includes('not found')) {
      return <div className="text-center text-warning">No emoji map found for this set. Use the table above to create one.</div>;
    }
    return <div className="text-center text-error">{loadError}</div>;
  }
  if (!emojiBase || (setKey !== 'native' && !setMap)) return <div className="text-center">No data loaded.</div>;
  const code = emojiList[index];
  const meta = emojiBase[code];
  const asset = setMap ? setMap[code]?.assetPath : null;
  return (
    <div className="card app-card-base bg-base-200">
      <div className="card-body">
        <h2 className="app-section-header-base text-lg mb-1">Emoji DB Browser</h2>
        <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
          <select className="select select-bordered" value={setKey} onChange={e => setSetKey(e.target.value)}>
            <option value="native">Native (Platform)</option>
            {Object.entries(EMOJI_SYSTEM_CONFIG.sets).map(([key, conf]) => (
              <option key={key} value={key}>{conf.name}</option>
            ))}
          </select>
          <input
            className="input input-bordered"
            placeholder="Shortcode or codepoint"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') jumpTo(input); }}
          />
          <button className="btn btn-secondary" onClick={() => jumpTo(input)}>Go</button>
          <button className="btn btn-accent" onClick={() => setIndex(Math.floor(Math.random() * emojiList.length))}>Random</button>
        </div>
        <div className="flex items-center justify-center gap-4 mb-2">
          <button className="btn btn-outline btn-sm" onClick={() => setIndex((index - 1 + emojiList.length) % emojiList.length)}>&larr;</button>
          <div className="text-center cursor-pointer" onClick={() => setIndex(Math.floor(Math.random() * emojiList.length))}>
            {setKey === 'native' ? (
              <span style={{ fontSize: '3rem', lineHeight: 1 }}>{meta.unicode}</span>
            ) : asset ? (
              <img src={asset} alt={meta.name} className="w-16 h-16 mx-auto" />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-base-300 rounded text-lg font-bold">Nomoji!</div>
            )}
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setIndex((index + 1) % emojiList.length)}>&rarr;</button>
        </div>
        <div className="text-sm text-center">
          <div><span className="font-semibold">Codepoint:</span> {code}</div>
          <div><span className="font-semibold">Shortcodes:</span> {(meta.shortcodes || []).join(', ')}</div>
          <button className="btn btn-xs btn-outline mt-2" onClick={() => setShowAll(v => !v)}>{showAll ? 'Hide All' : 'All'}</button>
        </div>
        {showAll && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Native */}
            <div className="flex flex-col items-center">
              <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{meta.unicode}</span>
              <span className="mt-1 text-xs">Native (Platform)</span>
            </div>
            {/* All asset sets */}
            {Object.entries(EMOJI_SYSTEM_CONFIG.sets).map(([setId, setConf]) => {
              // Try to get asset for this set
              let asset = null;
              if (setId === setKey) {
                asset = setMap ? setMap[code]?.assetPath : null;
              } else {
                // Try to load the map for this set from window.emojiSetMaps cache or fetch if not present
                // For now, try to fetch synchronously (not ideal for perf, but works for dev tool)
                // In a real app, you'd want to prefetch or cache these
                if (typeof window !== 'undefined') {
                  if (!window.emojiSetMaps) window.emojiSetMaps = {};
                  if (!window.emojiSetMaps[setId]) {
                    // Try to fetch and cache
                    fetch(`/dev/emoji/emoji-${setId}.json`).then(r => r.ok ? r.json() : null).then(map => {
                      if (map) window.emojiSetMaps![setId] = map;
                    });
                  }
                  asset = window.emojiSetMaps[setId]?.[code]?.assetPath || null;
                }
              }
              return (
                <div key={setId} className="flex flex-col items-center">
                  {asset ? (
                    <img src={asset} alt={meta.name} style={{ width: '2.5rem', height: '2.5rem' }} />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-base-300 rounded text-lg font-bold">Nomoji!</div>
                  )}
                  <span className="mt-1 text-xs">{setConf.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmojiSetInstallModal({ open, onClose, setId, setConf }: { open: boolean, onClose: () => void, setId: string, setConf: any }) {
  if (!open) return null;
  let instructions = null;
  if (setId === 'twemoji') {
    instructions = (
      <>
        <p>
          To add the latest Twemoji SVG assets to your project, follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <span className="font-medium">Download or clone the Twemoji repository from GitHub:</span>
            <pre className="bg-base-300 rounded p-2 mt-1 overflow-x-auto"><code>https://github.com/twitter/twemoji</code></pre>
            <a href="https://github.com/twitter/twemoji" target="_blank" rel="noopener noreferrer" className="app-link-base">Open Twemoji GitHub Repository</a>
          </li>
          <li>
            <span className="font-medium">Copy the <code>assets/svg/</code> folder from the repository into your project at <code>public/emoji/twemoji/</code> by hand.</span>
          </li>
        </ol>
        <p>
          <span className="font-medium">Why?</span> Twitter no longer provides a standalone SVG zip or npm package with SVGs. Manual copying is required.
        </p>
        <p className="text-xs text-gray-500">
          After copying, reference SVGs from <code>public/emoji/twemoji/svg/</code> in your app.
        </p>
      </>
    );
  } else {
    instructions = (
      <>
        <p>Instructions for installing <b>{setConf.name}</b> assets will go here.</p>
        <p className="text-xs text-gray-500">(No instructions yet. Please add them in the future.)</p>
      </>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.60)' }}>
      <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 btn btn-xs btn-circle" onClick={onClose}>✕</button>
        <h3 className="text-lg font-bold mb-2">Install {setConf.name} Assets</h3>
        <div className="space-y-2">{instructions}</div>
      </div>
    </div>
  );
}

// Utility to handle standardized API responses
function handleApiResponse(data: any) {
  if (!data || typeof data.success !== 'boolean') {
    return { success: false, error: 'Invalid server response' };
  }
  if (!data.success) {
    return { success: false, error: data.error || 'Unknown error' };
  }
  return { success: true, data: data.data };
}

export default EmojiAssetsDevPage; 