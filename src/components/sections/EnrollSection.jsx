import { EditableText } from '../ui/EditableText';

const SPACING = { compact: 'py-12', normal: 'py-16 sm:py-24', spacious: 'py-20 sm:py-36' };

function isSafeUrl(url) {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch { return false; }
}

export function EnrollSection({ enrollButton, isAdmin, onUpdate, spacing = 'normal' }) {
  const safeUrl  = isSafeUrl(enrollButton.url) ? enrollButton.url.trim() : null;
  const hasUrl   = !!safeUrl;
  const btnColor = enrollButton.buttonColor    || '#4f46e5';
  const btnColor2= enrollButton.buttonColorEnd || '#7c3aed';

  return (
    <section className={`px-4 sm:px-6 ${SPACING[spacing]} text-center`}>
      <div className="max-w-2xl mx-auto">
        <EditableText
          value={enrollButton.tagline || 'Dá el primer paso hacia tu camino musical'}
          onChange={v => onUpdate(['enrollButton', 'tagline'], v)}
          isAdmin={isAdmin}
          tag="p"
          className="text-base sm:text-lg text-white/50 mb-8 sm:mb-10"
          textStyle={enrollButton.taglineStyle ?? {}}
          onStyleChange={s => onUpdate(['enrollButton', 'taglineStyle'], s)}
        />

        <a
          href={hasUrl ? safeUrl : undefined}
          target={hasUrl ? '_blank' : undefined}
          rel="noopener noreferrer nofollow"
          onClick={!hasUrl && !isAdmin ? e => e.preventDefault() : undefined}
          className="inline-block w-full sm:w-auto text-white font-bold text-base sm:text-xl py-4 sm:py-5 px-8 sm:px-14 rounded-xl sm:rounded-2xl shadow-lg transition-all hover:-translate-y-1"
          style={{ background: `linear-gradient(to right, ${btnColor}, ${btnColor2})` }}
        >
          <EditableText
            value={enrollButton.text}
            onChange={v => onUpdate(['enrollButton', 'text'], v)}
            isAdmin={isAdmin}
            tag="span"
            className="text-white font-bold"
          />
        </a>

        {isAdmin && (
          <div className="mt-6 flex flex-col items-center gap-3">
            {/* URL */}
            <div className="flex flex-col items-center gap-1 w-full">
              <label className="text-white/40 text-xs">URL de destino (Homart)</label>
              <input
                type="url"
                placeholder="https://homart.com/tu-enlace"
                value={enrollButton.url}
                onChange={e => onUpdate(['enrollButton', 'url'], e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400/60 w-full max-w-sm placeholder:text-white/25 transition-all"
              />
            </div>

            {/* Colores del botón */}
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-xs">Color botón:</span>
              <label className="relative cursor-pointer" title="Color inicio">
                <div className="w-7 h-7 rounded-lg border-2 border-white/30 hover:border-white/60 transition-all" style={{ backgroundColor: btnColor }} />
                <input type="color" value={btnColor} onChange={e => onUpdate(['enrollButton', 'buttonColor'], e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
              </label>
              <label className="relative cursor-pointer" title="Color fin">
                <div className="w-7 h-7 rounded-lg border-2 border-white/30 hover:border-white/60 transition-all" style={{ backgroundColor: btnColor2 }} />
                <input type="color" value={btnColor2} onChange={e => onUpdate(['enrollButton', 'buttonColorEnd'], e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
              </label>
              <button
                onClick={() => { onUpdate(['enrollButton', 'buttonColor'], '#4f46e5'); onUpdate(['enrollButton', 'buttonColorEnd'], '#7c3aed'); }}
                className="text-white/30 hover:text-white/60 text-xs px-2 py-1 rounded border border-white/15 hover:border-white/30 transition-colors"
              >
                reset
              </button>
            </div>
          </div>
        )}

        {!hasUrl && !isAdmin && (
          <p className="text-white/20 text-xs mt-4">Inscripciones próximamente</p>
        )}
      </div>
    </section>
  );
}
