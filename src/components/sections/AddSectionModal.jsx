const TEMPLATES = [
  {
    type: 'text',
    icon: '📝',
    label: 'Texto',
    description: 'Bloque de texto editable con todos los estilos',
    default: { text: 'Escribí algo aquí...', textStyle: {} },
  },
  {
    type: 'image',
    icon: '🖼️',
    label: 'Imagen',
    description: 'Imagen grande con pie de foto opcional',
    default: { image: null, caption: '', captionStyle: {} },
  },
  {
    type: 'text-image',
    icon: '📋',
    label: 'Texto + Imagen',
    description: 'Texto al lado de una imagen (invertible)',
    default: { title: 'Título', text: 'Descripción...', image: null, reversed: false, titleStyle: {}, textStyle: {} },
  },
  {
    type: 'quote',
    icon: '❝',
    label: 'Cita destacada',
    description: 'Texto en grande para frases o testimonios',
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
    type: 'social-post',
    icon: '📱',
    label: 'Post de Redes',
    description: 'Tarjeta estilo Instagram / Facebook / X',
    default: {
      platform: 'instagram',
      username: '@daniel.musico',
      avatar: null,
      text: 'Comparte un mensaje o testimonio de tus alumnos...',
      image: null,
      likes: '127',
      comments: '23',
      date: 'hace 2 días',
      textStyle: {},
    },
  },
];

export function AddSectionModal({ onAdd, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold text-lg">Agregar sección</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-lg">
            ×
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
          {TEMPLATES.map(t => (
            <button
              key={t.type}
              onClick={() => { onAdd(t.type, t.default); onClose(); }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all group text-center"
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="text-white font-medium text-sm">{t.label}</span>
              <span className="text-white/40 text-xs leading-snug hidden sm:block">{t.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
