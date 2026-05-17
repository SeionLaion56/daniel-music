import { useId } from 'react';
import { EditableImage } from '../../ui/EditableImage';
import { uploadToStorage } from '../../../lib/supabaseStorage';

export function GalleryBlock({ section, isAdmin, onUpdate }) {
  const id = useId();
  const images = section.images ?? [];

  const handleAddImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToStorage(file);
      onUpdate('images', [...images, { id: Date.now(), url, caption: '' }]);
    } catch { alert('Error subiendo imagen.'); }
    e.target.value = '';
  };

  const removeImage = (index) => {
    onUpdate('images', images.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <div key={img.id} className="relative group rounded-lg sm:rounded-xl overflow-hidden shadow-lg aspect-square">
            <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
            {isAdmin && (
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/80 hover:bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {isAdmin && (
          <label htmlFor={id}
            className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/70 transition-all cursor-pointer"
          >
            <span className="text-3xl font-thin">+</span>
            <span className="text-xs">Agregar foto</span>
            <input id={id} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAddImage} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}
