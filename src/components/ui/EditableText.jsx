import { useState, useRef, useEffect } from 'react';

const FONTS_KEY = 'daniel_music_custom_fonts';

const PRESET_FONTS = [
  { label: 'Predeterminado',  value: '' },
  { label: 'Inter',           value: 'Inter, sans-serif' },
  { label: 'Montserrat',      value: 'Montserrat, sans-serif' },
  { label: 'Raleway',         value: 'Raleway, sans-serif' },
  { label: 'Playfair Display',value: '"Playfair Display", serif' },
];

// Presets rápidos de tamaño (en px)
const SIZE_PRESETS = [
  { label: 'S',   value: 14 },
  { label: 'M',   value: 18 },
  { label: 'L',   value: 24 },
  { label: 'XL',  value: 36 },
  { label: '2XL', value: 48 },
];

const SAFE_FONT_NAME_RE   = /^[a-zA-Z0-9\s\-]{1,80}$/;
const SAFE_FONT_FAMILY_RE = /^[a-zA-Z0-9\s"',\-]{1,200}$/;

function sanitizeFontFamily(v) {
  if (!v || typeof v !== 'string') return undefined;
  return SAFE_FONT_FAMILY_RE.test(v) ? v : undefined;
}
function isCustomFont(f) { return !!f && !PRESET_FONTS.some(p => p.value === f); }
function extractFontName(f) { const m = (f || '').match(/^"?([^",]+)"?/); return m ? m[1].trim() : f; }

function loadGoogleFont(fontName) {
  if (!SAFE_FONT_NAME_RE.test(fontName.trim())) return;
  const enc = encodeURIComponent(fontName.trim()).replace(/%20/g, '+');
  const id  = `gfont-${enc}`;
  if (!document.getElementById(id)) {
    const link = Object.assign(document.createElement('link'), {
      id, rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${enc}:ital,wght@0,400;0,700;1,400&display=swap`,
    });
    document.head.appendChild(link);
  }
}

function getSavedFonts() { try { return JSON.parse(localStorage.getItem(FONTS_KEY) || '[]'); } catch { return []; } }
function saveFont(name)   { const l = getSavedFonts(); if (!l.includes(name)) localStorage.setItem(FONTS_KEY, JSON.stringify([...l, name])); }

// Convierte fontSize string → número px (null si no aplica)
function parsePx(fontSize) {
  if (!fontSize) return '';
  const m = fontSize.match(/^(\d+(?:\.\d+)?)(px|rem)$/);
  if (!m) return '';
  return m[2] === 'px' ? Math.round(Number(m[1])) : Math.round(Number(m[1]) * 16);
}

function AlignIcon({ align }) {
  if (align === 'left') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3"/><line x1="1" y1="7" x2="9" y2="7"/><line x1="1" y1="11" x2="11" y2="11"/>
    </svg>
  );
  if (align === 'center') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3"/><line x1="3" y1="7" x2="11" y2="7"/><line x1="2" y1="11" x2="12" y2="11"/>
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3"/><line x1="5" y1="7" x2="13" y2="7"/><line x1="3" y1="11" x2="13" y2="11"/>
    </svg>
  );
}

export function EditableText({
  value, onChange, isAdmin,
  tag: Tag = 'p', className = '', multiline = false,
  textStyle = {}, onStyleChange,
}) {
  const [editing, setEditing]           = useState(false);
  const [draft, setDraft]               = useState(value);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customFontName, setCustomFontName]   = useState('');
  const [customFonts, setCustomFonts]   = useState(getSavedFonts);

  const inputRef      = useRef(null);
  const customFontRef = useRef(null);

  const inlineStyle = {
    textAlign:  textStyle?.align      || undefined,
    fontSize:   textStyle?.fontSize   || undefined,
    fontFamily: sanitizeFontFamily(textStyle?.fontFamily),
    color:      textStyle?.color      || undefined,
  };
  const inputStyle = { ...inlineStyle, color: textStyle?.color || 'white' };

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);
  useEffect(() => {
    if (editing && isCustomFont(textStyle?.fontFamily)) {
      setCustomFontName(extractFontName(textStyle.fontFamily));
      setShowCustomInput(true);
    }
  }, [editing]);

  const commit = () => { setEditing(false); setShowCustomInput(false); if (draft !== value) onChange(draft); };
  const cancel = () => { setDraft(value); setEditing(false); setShowCustomInput(false); };
  const handleContainerBlur = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) commit(); };
  const updateStyle = (key, val) => onStyleChange?.({ ...(textStyle ?? {}), [key]: val });

  const handleFontSelect = (val) => {
    if (val === '__custom__') { setShowCustomInput(true); setCustomFontName(''); setTimeout(() => customFontRef.current?.focus(), 50); }
    else { setShowCustomInput(false); updateStyle('fontFamily', val); }
  };

  const applyCustomFont = () => {
    const name = customFontName.trim();
    if (!name) return;
    loadGoogleFont(name);
    saveFont(name);
    setCustomFonts(getSavedFonts());
    updateStyle('fontFamily', `"${name}", sans-serif`);
    setShowCustomInput(false);
  };

  const currentPx = parsePx(textStyle?.fontSize);

  const allFonts = [
    ...PRESET_FONTS,
    ...customFonts.map(n => ({ label: n, value: `"${n}", sans-serif` })),
    { label: '+ Fuente propia...', value: '__custom__' },
  ];
  const selectValue = isCustomFont(textStyle?.fontFamily)
    ? (allFonts.some(f => f.value === textStyle.fontFamily) ? textStyle.fontFamily : '__custom__')
    : (textStyle?.fontFamily ?? '');

  if (!isAdmin) return <Tag className={className} style={inlineStyle}>{value}</Tag>;

  if (editing) {
    return (
      <div className="w-full" onBlur={handleContainerBlur}>

        {/* ── Toolbar — scrollable en mobile ── */}
        <div className="mb-2 bg-gray-950/95 border border-white/20 rounded-xl shadow-2xl overflow-x-auto">
          <div className="flex items-center gap-1 px-2 py-1.5 min-w-max">

            {/* Alineación */}
            {['left', 'center', 'right'].map(align => (
              <button key={align} type="button"
                onMouseDown={e => { e.preventDefault(); updateStyle('align', align); }}
                className={`p-2 rounded-lg transition-colors shrink-0 ${textStyle?.align === align ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                title={align === 'left' ? 'Izquierda' : align === 'center' ? 'Centro' : 'Derecha'}
              >
                <AlignIcon align={align} />
              </button>
            ))}

            <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />

            {/* Color del texto */}
            <label className="relative cursor-pointer shrink-0" title="Color del texto">
              <div className="w-7 h-7 rounded-lg border-2 border-white/30 hover:border-white/60 transition-all flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: textStyle?.color || '#ffffff' }}>
                <span className="text-xs font-bold" style={{ color: textStyle?.color ? 'transparent' : '#000', textShadow: 'none' }}>A</span>
              </div>
              <input type="color" value={textStyle?.color || '#ffffff'}
                onChange={e => updateStyle('color', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
            </label>

            <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />

            {/* Presets de tamaño */}
            {SIZE_PRESETS.map(s => (
              <button key={s.value} type="button"
                onMouseDown={e => { e.preventDefault(); updateStyle('fontSize', `${s.value}px`); }}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors shrink-0 ${currentPx === s.value ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
              >
                {s.label}
              </button>
            ))}

            {/* Input numérico en px */}
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number" min="8" max="200"
                placeholder="px"
                value={currentPx}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 8 && v <= 200) updateStyle('fontSize', `${v}px`);
                }}
                className="w-14 bg-gray-900 border border-white/20 rounded-lg px-2 py-0.5 text-white text-xs text-center outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <span className="text-white/35 text-xs">px</span>
            </div>

            <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />

            {/* Fuente */}
            <select tabIndex={0} value={selectValue}
              onChange={e => handleFontSelect(e.target.value)}
              className="bg-gray-900 border border-white/20 rounded-lg px-2 py-0.5 text-white text-xs outline-none cursor-pointer shrink-0"
            >
              {allFonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>

            {/* Reset */}
            {Object.values(textStyle ?? {}).some(Boolean) && (
              <>
                <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />
                <button type="button"
                  onMouseDown={e => { e.preventDefault(); onStyleChange?.({}); setShowCustomInput(false); }}
                  className="px-2 py-1 rounded text-xs text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors shrink-0"
                >
                  reset
                </button>
              </>
            )}
          </div>
        </div>

        {/* Fuente personalizada */}
        {showCustomInput && (
          <div className="flex items-center gap-2 mb-2">
            <input ref={customFontRef} type="text"
              placeholder="Ej: Dancing Script, Roboto Slab..."
              value={customFontName}
              onChange={e => setCustomFontName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCustomFont(); } if (e.key === 'Escape') setShowCustomInput(false); }}
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400/60 placeholder:text-white/25"
              style={{ color: 'white' }}
            />
            <button type="button"
              onMouseDown={e => { e.preventDefault(); applyCustomFont(); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              Aplicar
            </button>
          </div>
        )}

        {/* Campo de texto */}
        {multiline ? (
          <textarea ref={inputRef} value={draft} rows={3}
            maxLength={2000}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') cancel(); }}
            className={`${className} w-full bg-white/10 border border-white/40 rounded-lg px-3 py-2 outline-none ring-2 ring-indigo-400/60 resize-none`}
            style={inputStyle}
          />
        ) : (
          <input ref={inputRef} type="text" value={draft}
            maxLength={300}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') cancel(); if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
            className={`${className} w-full bg-white/10 border border-white/40 rounded-lg px-3 py-1 outline-none ring-2 ring-indigo-400/60`}
            style={inputStyle}
          />
        )}

        {/* Guardar / Cancelar */}
        <div className="flex justify-end gap-2 mt-2">
          <button type="button"
            onMouseDown={e => { e.preventDefault(); cancel(); }}
            className="text-white/40 hover:text-white/70 text-xs px-3 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors min-h-9"
          >
            Cancelar
          </button>
          <button type="button"
            onMouseDown={e => { e.preventDefault(); commit(); }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors min-h-9"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Guardar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={`${className} cursor-pointer rounded transition-all hover:outline-2 hover:outline-white/40 hover:outline-offset-2`}
      style={inlineStyle}
      onClick={() => setEditing(true)}
      title="Clic para editar"
    >
      {value || <span className="opacity-30 italic text-sm">[clic para agregar texto]</span>}
    </Tag>
  );
}
