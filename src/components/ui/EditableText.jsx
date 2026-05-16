import { useState, useRef, useEffect } from 'react';

const FONTS_KEY = 'daniel_music_custom_fonts';

const PRESET_FONTS = [
  { label: 'Predeterminado', value: '' },
  { label: 'Inter',           value: 'Inter, sans-serif' },
  { label: 'Montserrat',      value: 'Montserrat, sans-serif' },
  { label: 'Raleway',         value: 'Raleway, sans-serif' },
  { label: 'Playfair Display',value: '"Playfair Display", serif' },
];

const SIZES = [
  { label: 'XS',  value: '0.75rem'  },
  { label: 'S',   value: '1rem'     },
  { label: 'M',   value: '1.375rem' },
  { label: 'L',   value: '1.875rem' },
  { label: 'XL',  value: '2.5rem'   },
  { label: '2XL', value: '3.5rem'   },
  { label: '3XL', value: '5rem'     },
];

function getSavedCustomFonts() {
  try { return JSON.parse(localStorage.getItem(FONTS_KEY) || '[]'); }
  catch { return []; }
}

function saveCustomFontToStorage(name) {
  const list = getSavedCustomFonts();
  if (!list.includes(name)) {
    list.push(name);
    localStorage.setItem(FONTS_KEY, JSON.stringify(list));
  }
}

function isCustomFont(fontFamily) {
  if (!fontFamily) return false;
  return !PRESET_FONTS.some(f => f.value === fontFamily);
}

function extractFontName(fontFamily) {
  const m = (fontFamily || '').match(/^"?([^",]+)"?/);
  return m ? m[1].trim() : fontFamily;
}

function loadGoogleFont(fontName) {
  const encoded = encodeURIComponent(fontName.trim()).replace(/%20/g, '+');
  const id = `gfont-${encoded}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,700;1,400&display=swap`;
    document.head.appendChild(link);
  }
}

function AlignIcon({ align }) {
  if (align === 'left') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3" /><line x1="1" y1="7" x2="9" y2="7" /><line x1="1" y1="11" x2="11" y2="11" />
    </svg>
  );
  if (align === 'center') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3" /><line x1="3" y1="7" x2="11" y2="7" /><line x1="2" y1="11" x2="12" y2="11" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3" /><line x1="5" y1="7" x2="13" y2="7" /><line x1="3" y1="11" x2="13" y2="11" />
    </svg>
  );
}

export function EditableText({
  value,
  onChange,
  isAdmin,
  tag: Tag = 'p',
  className = '',
  multiline = false,
  textStyle = {},
  onStyleChange,
}) {
  const [editing, setEditing]         = useState(false);
  const [draft, setDraft]             = useState(value);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customFontName, setCustomFontName]   = useState('');
  const [customFonts, setCustomFonts] = useState(getSavedCustomFonts);

  const inputRef      = useRef(null);
  const customFontRef = useRef(null);

  const inlineStyle = {
    textAlign:  textStyle?.align      || undefined,
    fontSize:   textStyle?.fontSize   || undefined,
    fontFamily: textStyle?.fontFamily || undefined,
  };
  const inputStyle = { ...inlineStyle, color: 'white' };

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (editing && isCustomFont(textStyle?.fontFamily)) {
      setCustomFontName(extractFontName(textStyle.fontFamily));
      setShowCustomInput(true);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    setShowCustomInput(false);
    if (draft !== value) onChange(draft);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    setShowCustomInput(false);
  };

  const handleContainerBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) commit();
  };

  const updateStyle = (key, val) =>
    onStyleChange?.({ ...(textStyle ?? {}), [key]: val });

  const handleFontSelect = (val) => {
    if (val === '__custom__') {
      setShowCustomInput(true);
      setCustomFontName('');
      setTimeout(() => customFontRef.current?.focus(), 50);
    } else {
      setShowCustomInput(false);
      updateStyle('fontFamily', val);
    }
  };

  const applyCustomFont = () => {
    const name = customFontName.trim();
    if (!name) return;
    loadGoogleFont(name);
    saveCustomFontToStorage(name);
    setCustomFonts(getSavedCustomFonts());     // refresca la lista en este componente
    updateStyle('fontFamily', `"${name}", sans-serif`);
    setShowCustomInput(false);
  };

  // Todas las fuentes disponibles en el select
  const allFonts = [
    ...PRESET_FONTS,
    ...customFonts.map(n => ({ label: n, value: `"${n}", sans-serif` })),
    { label: '+ Fuente propia...', value: '__custom__' },
  ];

  const selectValue = isCustomFont(textStyle?.fontFamily)
    ? (allFonts.some(f => f.value === textStyle.fontFamily)
        ? textStyle.fontFamily   // fuente propia ya en la lista
        : '__custom__')          // fuente propia aún no en lista
    : (textStyle?.fontFamily ?? '');

  if (!isAdmin) {
    return <Tag className={className} style={inlineStyle}>{value}</Tag>;
  }

  if (editing) {
    return (
      <div className="w-full" onBlur={handleContainerBlur}>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-1 mb-2 flex-wrap bg-gray-950/95 border border-white/20 rounded-xl px-2 py-1.5 shadow-2xl">

          {/* Alineación */}
          {['left', 'center', 'right'].map(align => (
            <button
              key={align}
              type="button"
              onMouseDown={e => { e.preventDefault(); updateStyle('align', align); }}
              className={`p-1.5 rounded-lg transition-colors ${textStyle?.align === align ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
              title={align === 'left' ? 'Izquierda' : align === 'center' ? 'Centro' : 'Derecha'}
            >
              <AlignIcon align={align} />
            </button>
          ))}

          <div className="w-px h-5 bg-white/20 mx-0.5" />

          {/* Tamaño */}
          {SIZES.map(s => (
            <button
              key={s.value}
              type="button"
              onMouseDown={e => { e.preventDefault(); updateStyle('fontSize', s.value); }}
              className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors ${textStyle?.fontSize === s.value ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              {s.label}
            </button>
          ))}

          <div className="w-px h-5 bg-white/20 mx-0.5" />

          {/* Fuente */}
          <select
            tabIndex={0}
            value={selectValue}
            onChange={e => handleFontSelect(e.target.value)}
            className="bg-gray-900 border border-white/20 rounded-lg px-2 py-0.5 text-white text-xs outline-none cursor-pointer"
          >
            {allFonts.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* Reset */}
          {Object.values(textStyle ?? {}).some(Boolean) && (
            <>
              <div className="w-px h-5 bg-white/20 mx-0.5" />
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); onStyleChange?.({}); setShowCustomInput(false); }}
                className="px-1.5 py-0.5 rounded text-xs text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors"
                title="Resetear estilos"
              >
                reset
              </button>
            </>
          )}
        </div>

        {/* ── Fuente personalizada ── */}
        {showCustomInput && (
          <div className="flex items-center gap-2 mb-2">
            <input
              ref={customFontRef}
              type="text"
              placeholder="Ej: Dancing Script, Roboto Slab..."
              value={customFontName}
              onChange={e => setCustomFontName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); applyCustomFont(); }
                if (e.key === 'Escape') setShowCustomInput(false);
              }}
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400/60 placeholder:text-white/25"
              style={{ color: 'white' }}
            />
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); applyCustomFont(); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              Aplicar
            </button>
          </div>
        )}

        {/* ── Campo de texto ── */}
        {multiline ? (
          <textarea
            ref={inputRef}
            value={draft}
            rows={4}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') cancel(); }}
            className={`${className} w-full bg-white/10 border border-white/40 rounded-lg px-3 py-2 outline-none ring-2 ring-indigo-400/60 resize-none`}
            style={inputStyle}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') cancel();
              if (e.key === 'Enter') { e.preventDefault(); commit(); }
            }}
            className={`${className} w-full bg-white/10 border border-white/40 rounded-lg px-3 py-1 outline-none ring-2 ring-indigo-400/60`}
            style={inputStyle}
          />
        )}

        {/* ── Botones Guardar / Cancelar ── */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); cancel(); }}
            className="text-white/40 hover:text-white/70 text-xs px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); commit(); }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
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
