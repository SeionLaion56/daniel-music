import { useState, useCallback } from 'react';
import { uploadToStorage } from '../lib/supabaseStorage';

const ACCEPTED = 'image/png,image/jpeg,image/webp,video/mp4';

export function BackgroundUploader({ background, onBackgroundChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4'];
    if (!allowed.includes(file.type)) {
      alert('Formato no soportado. Use PNG, JPEG, WebP o MP4.');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    setUploading(true);
    try {
      const url = await uploadToStorage(file);
      onBackgroundChange({ ...background, type: isVideo ? 'video' : 'image', url });
    } catch {
      alert('Error subiendo el archivo. Intentá de nuevo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [background, onBackgroundChange]);

  const handleGradient = useCallback((key, value) => {
    onBackgroundChange({ ...background, type: 'default', url: null, [key]: value });
  }, [background, onBackgroundChange]);

  const handleReset = useCallback(() => {
    onBackgroundChange({ type: 'default', url: null, gradientStart: '#1a1a2e', gradientEnd: '#16213e' });
  }, [onBackgroundChange]);

  return (
    <div className="flex items-center gap-2">
      {/* Color pickers del degradado */}
      <div className="flex items-center gap-1" title="Colores del degradado">
        {[
          { key: 'gradientStart', label: 'Color inicio' },
          { key: 'gradientEnd',   label: 'Color fin'    },
        ].map(({ key, label }) => (
          <label key={key} title={label}
            className="relative w-6 h-6 rounded-md cursor-pointer border border-white/30 hover:border-white/60 transition-all overflow-hidden shrink-0"
            style={{ backgroundColor: background[key] }}
          >
            <input type="color" value={background[key]}
              onChange={e => handleGradient(key, e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
          </label>
        ))}
      </div>

      <div className="w-px h-5 bg-white/20" />

      {/* Subir imagen / video */}
      <input type="file" accept={ACCEPTED} onChange={handleFileChange}
        disabled={uploading} className="hidden" id="bg-input" />
      <label htmlFor="bg-input"
        title="Subir imagen o video de fondo"
        className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-xs font-medium transition-all duration-150 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {uploading ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Subiendo...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Fondo
          </>
        )}
      </label>

      {/* Reset */}
      <button onClick={handleReset} title="Restaurar fondo por defecto"
        className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white/50 hover:text-white/80 transition-all duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}
