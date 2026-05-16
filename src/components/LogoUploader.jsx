import { useState, useCallback } from 'react';
import { uploadToStorage } from '../lib/supabaseStorage';

export function LogoUploader({ logoUrl, onLogoChange, isAdmin = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      alert('Por favor cargue un archivo PNG, JPEG, SVG o WebP');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToStorage(file);
      onLogoChange(url);
    } catch {
      alert('Error subiendo el logo. Intentá de nuevo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [onLogoChange]);

  if (!isAdmin) {
    if (!logoUrl) return <div className="w-40 h-14" />;
    return (
      <img src={logoUrl} alt="Logo" className="w-40 h-14 object-contain"
        onError={e => { e.target.style.display = 'none'; }} />
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <input type="file" onChange={handleFileChange} accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden" id="logo-input" disabled={uploading} aria-label="Cambiar logo" />

      <label htmlFor="logo-input"
        className={`relative group cursor-pointer hover:opacity-80 transition-opacity ${uploading ? 'pointer-events-none' : ''}`}
        title="Clic para cambiar logo"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-40 h-14 object-contain rounded"
            onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="w-40 h-14 bg-white/10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/40 text-xs hover:bg-white/20 transition-colors">
            {uploading ? 'Subiendo...' : '+ Logo'}
          </div>
        )}
        {!uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded text-white text-xs font-medium">
            Cambiar logo
          </span>
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 rounded text-white text-xs">
            Subiendo...
          </span>
        )}
      </label>
    </div>
  );
}
