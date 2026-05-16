import { useCallback, useId } from 'react';

export function EditableImage({
  src,
  onChange,
  isAdmin,
  alt = '',
  className = '',
  placeholder = null,
}) {
  const id = useId();

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
    e.target.value = '';
  }, [onChange]);

  if (!isAdmin) {
    if (!src) return placeholder ?? null;
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="relative group">
      {src ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        placeholder ?? (
          <div className={`${className} bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-sm`}>
            Sin imagen
          </div>
        )
      )}
      <label
        htmlFor={id}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl"
        title="Clic para cambiar imagen"
      >
        <div className="flex flex-col items-center gap-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm font-medium">{src ? 'Cambiar imagen' : 'Agregar imagen'}</span>
        </div>
      </label>
      <input
        type="file"
        id={id}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
