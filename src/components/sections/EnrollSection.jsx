import { EditableText } from '../ui/EditableText';

const SPACING = { compact: 'py-12', normal: 'py-24', spacious: 'py-36' };

function isSafeUrl(url) {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function EnrollSection({ enrollButton, isAdmin, onUpdate, spacing = 'normal' }) {
  const safeUrl = isSafeUrl(enrollButton.url) ? enrollButton.url.trim() : null;
  const hasUrl = !!safeUrl;

  return (
    <section className={`px-6 ${SPACING[spacing]} text-center`}>
      <div className="max-w-2xl mx-auto">
        <EditableText
          value={enrollButton.tagline || 'Dá el primer paso hacia tu camino musical'}
          onChange={v => onUpdate(['enrollButton', 'tagline'], v)}
          isAdmin={isAdmin}
          tag="p"
          className="text-white/50 text-lg mb-10"
          textStyle={enrollButton.taglineStyle ?? {}}
          onStyleChange={s => onUpdate(['enrollButton', 'taglineStyle'], s)}
        />

        <a
          href={hasUrl ? safeUrl : undefined}
          target={hasUrl ? '_blank' : undefined}
          rel="noopener noreferrer nofollow"
          onClick={!hasUrl && !isAdmin ? e => e.preventDefault() : undefined}
          className="inline-block bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xl py-5 px-14 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 hover:shadow-indigo-500/50"
        >
          <EditableText
            value={enrollButton.text}
            onChange={v => onUpdate(['enrollButton', 'text'], v)}
            isAdmin={isAdmin}
            tag="span"
            className="text-white font-bold text-xl"
          />
        </a>

        {isAdmin && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <label className="text-white/40 text-xs">URL de destino (Homart)</label>
            <input
              type="url"
              placeholder="https://homart.com/tu-enlace"
              value={enrollButton.url}
              onChange={e => onUpdate(['enrollButton', 'url'], e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400/60 w-80 placeholder:text-white/25 transition-all"
            />
          </div>
        )}

        {!hasUrl && !isAdmin && (
          <p className="text-white/20 text-xs mt-4">Inscripciones próximamente</p>
        )}
      </div>
    </section>
  );
}
