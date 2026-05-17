import { useId } from 'react';
import { Carousel } from '../../ui/Carousel';
import { uploadToStorage } from '../../../lib/supabaseStorage';

export function GalleryBlock({ section, isAdmin, onUpdate }) {
  const id     = useId();
  const images = section.images ?? [];

  const handleAddImage = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const uploaded = await Promise.all(
      files.map(async file => {
        try {
          const url = await uploadToStorage(file);
          return { id: Date.now() + Math.random(), url, caption: '' };
        } catch { return null; }
      })
    );
    const valid = uploaded.filter(Boolean);
    if (valid.length) onUpdate('images', [...images, ...valid]);
    e.target.value = '';
  };

  const removeImage = (imgId) => {
    onUpdate('images', images.filter(img => img.id !== imgId));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">

      {/* Carousel de fotos */}
      {images.length > 0 ? (
        <Carousel
          items={images}
          renderItem={(img) => (
            <div className="flex flex-col items-center gap-3 px-2">
              <img
                src={img.url}
                alt={img.caption || ''}
                className="w-full max-h-80 sm:max-h-96 object-cover rounded-xl shadow-xl"
              />
              {img.caption && (
                <p className="text-white/50 text-sm italic text-center">{img.caption}</p>
              )}
            </div>
          )}
          emptyMessage="Sin fotos"
        />
      ) : (
        <div className="glass rounded-xl p-8 text-center text-white/30">
          <div className="text-3xl mb-3">🖼️</div>
          <p className="text-sm">{isAdmin ? 'Agregá fotos a la galería' : 'Galería de fotos'}</p>
        </div>
      )}

      {/* Panel admin: miniaturas + agregar */}
      {isAdmin && (
        <div className="mt-4 glass rounded-xl p-4 flex flex-col gap-3">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
            Fotos en la galería ({images.length})
          </p>

          {/* Miniaturas con botón eliminar */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative group/thumb aspect-square">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* Agregar fotos */}
          <label htmlFor={id}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-sm cursor-pointer transition-all"
          >
            <span className="text-lg">+</span> Agregar fotos
            <input
              id={id}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleAddImage}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
