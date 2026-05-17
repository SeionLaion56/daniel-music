const TEMPLATES = [
  {
    type: 'text',
    icon: '📝',
    label: 'Texto',
    description: 'Bloque de texto con estilos completos',
    default: { text: 'Escribí algo aquí...', textStyle: {} },
  },
  {
    type: 'image',
    icon: '🖼️',
    label: 'Imagen',
    description: 'Imagen grande con pie de foto',
    default: { image: null, caption: '', captionStyle: {} },
  },
  {
    type: 'text-image',
    icon: '📋',
    label: 'Texto + Imagen',
    description: 'Texto al lado de imagen (invertible)',
    default: { title: 'Título', text: 'Descripción...', image: null, reversed: false, titleStyle: {}, textStyle: {} },
  },
  {
    type: 'quote',
    icon: '❝',
    label: 'Cita destacada',
    description: 'Frase grande con autor',
    default: { quote: '¡La música transforma vidas!', author: '— Alumno', quoteStyle: {}, authorStyle: {} },
  },
  {
    type: 'gallery',
    icon: '🖼️🖼️',
    label: 'Galería',
    description: 'Grid de fotos en mosaico',
    default: { images: [] },
  },
  {
    type: 'social-embed',
    icon: '📲',
    label: 'Post de Redes',
    description: 'Embed real de Instagram, X/Twitter o Facebook',
    default: { url: '' },
  },
];

// Secciones fijas que se pueden restaurar si fueron eliminadas
export const BUILTIN_META = {
  hero:    { icon: '🎵', label: 'Portada principal' },
  about:   { icon: '👤', label: 'Sobre el artista' },
  classes: { icon: '🎼', label: 'Clases' },
  enroll:  { icon: '📋', label: 'Botón de inscripción' },
};

export function AddSectionModal({ onAdd, onClose, hiddenBuiltins = [] }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold text-lg">Agregar sección</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-xl leading-none"
          >×</button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[65vh]">

          {/* Restaurar secciones ocultas */}
          {hiddenBuiltins.length > 0 && (
            <div className="mb-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2 px-1">Restaurar sección oculta</p>
              <div className="grid grid-cols-2 gap-2">
                {hiddenBuiltins.map(id => {
                  const meta = BUILTIN_META[id];
                  if (!meta) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { onAdd(id, null, true); onClose(); }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left"
                    >
                      <span className="text-xl">{meta.icon}</span>
                      <span className="text-white/80 text-sm font-medium">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-white/10 my-4" />
            </div>
          )}

          {/* Nuevos bloques */}
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2 px-1">Agregar nuevo bloque</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.type}
                onClick={() => { onAdd(t.type, t.default, false); onClose(); }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-center"
              >
                <span className="text-3xl">{t.icon}</span>
                <span className="text-white font-medium text-sm">{t.label}</span>
                <span className="text-white/40 text-xs leading-snug hidden sm:block">{t.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
