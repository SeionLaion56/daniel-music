import { useState } from 'react';

const SPACING_OPTIONS = [
  { value: 'compact',  label: 'Compacto'  },
  { value: 'normal',   label: 'Normal'    },
  { value: 'spacious', label: 'Espacioso' },
];

export function AdminBar({ onSave, onLogout, hasChanges, spacing, onSpacingChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Barra desktop */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-indigo-950/95 backdrop-blur-sm border-b border-indigo-800/50 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="text-white/90 text-sm font-semibold hidden xs:block">Modo edición</span>
          <span className="text-white/35 text-xs hidden lg:block">
            Clic en cualquier texto o imagen para editarlo
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Espaciado — solo en desktop */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/15 rounded-lg p-1">
            {SPACING_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onSpacingChange(opt.value)}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  spacing === opt.value
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-white/45 hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Botón menú mobile */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-colors"
            title="Opciones"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {hasChanges ? (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors min-h-[36px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden xs:inline">Guardar</span>
            </button>
          ) : (
            <span className="text-white/25 text-xs hidden sm:block">Sin cambios</span>
          )}

          <button
            onClick={onLogout}
            className="text-white/50 hover:text-white/80 text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors min-h-[36px]"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="md:hidden fixed top-[49px] left-0 right-0 z-40 bg-indigo-950/98 border-b border-indigo-800/50 px-4 py-3 flex flex-col gap-2">
          <p className="text-white/40 text-xs mb-1">Espaciado entre secciones</p>
          <div className="flex gap-2">
            {SPACING_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onSpacingChange(opt.value); setMenuOpen(false); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  spacing === opt.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
