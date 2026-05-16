const SPACING_OPTIONS = [
  { value: 'compact', label: 'Compacto' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Espacioso' },
];

export function AdminBar({ onSave, onLogout, hasChanges, spacing, onSpacingChange }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-indigo-950/95 backdrop-blur-sm border-b border-indigo-800/50 px-4 py-2 flex items-center justify-between gap-4">

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span className="text-white/90 text-sm font-semibold shrink-0">Modo edición</span>
        <span className="text-white/35 text-xs hidden md:block">
          Clic en cualquier texto o imagen para editarlo
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Control de espaciado — 3 botones solos sin etiqueta */}
        <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/15 rounded-lg p-1">
          {SPACING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSpacingChange(opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                spacing === opt.value
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/45 hover:text-white hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {hasChanges ? (
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Guardar
          </button>
        ) : (
          <span className="text-white/25 text-xs hidden sm:block">Sin cambios</span>
        )}

        <button
          onClick={onLogout}
          className="text-white/50 hover:text-white/80 text-sm px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
        >
          Salir
        </button>
      </div>
    </div>
  );
}
