import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh-Hans', label: 'Chinese (Simplified)' },
  { code: 'zh-Hant', label: 'Chinese (Traditional)' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ru', label: 'Russian' },
];

function Select({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '7px 10px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        background: '#fff',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

function Popup() {
  return (
    <div style={{ width: 260, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: '#1a73e8',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          🐾
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Capty-bara</span>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />

      {/* Primary language */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: 3,
              background: '#ffffff',
              border: '1px solid #9ca3af',
            }}
          />
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
            Primary language (white)
          </label>
        </div>
        <Select value={primary} onChange={setPrimary} />
      </div>

      {/* Secondary language */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: 3,
              background: '#FFD700',
              border: '1px solid #9ca3af',
            }}
          />
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
            Secondary language (gold)
          </label>
        </div>
        <Select value={secondary} onChange={setSecondary} />
      </div>

      {/* Save button */}
      <button
        onClick={save}
        style={{
          padding: '9px 0',
          background: saved ? '#16a34a' : '#1a73e8',
          color: '#fff',
          border: 'none',
          borderRadius: 7,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {saved ? 'Saved!' : 'Save settings'}
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Popup />);
