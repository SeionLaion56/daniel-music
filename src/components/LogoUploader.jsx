import { useCallback } from 'react';

export function LogoUploader({ logoUrl, onLogoChange, isAdmin = false }) {
    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
            alert('Por favor cargue un archivo PNG, JPEG, SVG o WebP');
            return;
        }
        const url = URL.createObjectURL(file);
        onLogoChange(url);
        e.target.value = '';
    }, [onLogoChange]);

    if (!isAdmin) {
        if (!logoUrl) return <div className="w-40 h-14" />;
        return (
            <img
                src={logoUrl}
                alt="Logo"
                className="w-40 h-14 object-contain"
                onError={e => { e.target.style.display = 'none'; }}
            />
        );
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                id="logo-input"
                aria-label="Cambiar logo"
            />
            <label
                htmlFor="logo-input"
                className="relative group cursor-pointer hover:opacity-80 transition-opacity"
                title="Clic para cambiar logo"
            >
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-40 h-14 object-contain rounded"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-40 h-14 bg-white/10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/40 text-xs hover:bg-white/20 transition-colors">
                        + Logo
                    </div>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded text-white text-xs font-medium">
                    Cambiar logo
                </span>
            </label>
        </div>
    );
}
