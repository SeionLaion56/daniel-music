import { useId } from 'react';
import { Carousel } from '../../ui/Carousel';
import { EditableText } from '../../ui/EditableText';
import { uploadToStorage } from '../../../lib/supabaseStorage';

// objectFit: cover → la imagen SIEMPRE llena el contenedor
// Al cambiar la altura del contenedor, la imagen visible crece/decrece realmente
const IMG_H = { sm: 160, md: 280, lg: 440 };
const SIZE_LABELS = { sm: 'Pequeño', md: 'Normal', lg: 'Grande' };

export function GalleryBlock({ section, isAdmin, onUpdate }) {
  const id     = useId();
  const images = section.images ?? [];
  const size   = section.size   ?? 'md';

  const handleAddImages = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const results = await Promise.all(
      files.map(async file => {
        try {
          const url = await uploadToStorage(file);
          return { id: Date.now() + Math.random(), url, caption: '' };
        } catch { return null; }
      })
    );
    const valid = results.filter(Boolean);
    if (valid.length) onUpdate('images', [...images, ...valid]);
    e.target.value = '';
  };

  const removeImage  = (imgId) => onUpdate('images', images.filter(img => img.id !== imgId));
  const updateCaption = (imgId, caption) =>
    onUpdate('images', images.map(img => img.id === imgId ? { ...img, caption } : img));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">

      {images.length > 0 ? (
        <>
          <Carousel
            items={images}
            renderItem={(img) => (
              <div className="flex flex-col items-center gap-3">
                {/* Contenedor con altura variable — cover llena siempre el espacio */}
                <div
                  className="w-full rounded-xl overflow-hidden"
                  style={{
                    height: `${IMG_H[size]}px`,
                    transition: 'height 300ms ease',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </div>

                {(img.caption || isAdmin) && (
                  <div className="w-full text-center px-2">
                    <EditableText
                      value={img.caption || 'Pie de foto...'}
                      onChange={v => updateCaption(img.id, v)}
                      isAdmin={isAdmin}
                      tag="p"
                      className="text-white/50 text-sm italic"
                      textStyle={section.captionStyle ?? {}}
                      onStyleChange={s => onUpdate('captionStyle', s)}
                    />
                  </div>
                )}
              </div>
            )}
            emptyMessage="Sin fotos"
          />

          {isAdmin && (
            <div className="flex justify-center gap-1 mt-3">
              {Object.entries(SIZE_LABELS).map(([s, label]) => (
                <button key={s} onClick={() => onUpdate('size', s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${size === s ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-xl p-8 text-center text-white/30">
          <div className="text-3xl mb-3">🖼️</div>
          <p className="text-sm">{isAdmin ? 'Agregá fotos a la galería' : 'Galería de fotos'}</p>
        </div>
      )}

      {isAdmin && (
        <div className="mt-4 glass rounded-xl p-4 flex flex-col gap-3">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Fotos ({images.length})</p>

          {images.length > 0 && (
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative group/thumb aspect-square">
                  <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ))}
            </div>
          )}

          <label htmlFor={id}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-sm cursor-pointer transition-all">
            <span className="text-lg">+</span> Agregar fotos
            <input id={id} type="file" accept="image/png,image/jpeg,image/webp"
              multiple onChange={handleAddImages} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
