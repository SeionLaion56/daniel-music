import { useState } from 'react';

function parseSocialUrl(url) {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());

    // Instagram: /p/{id}/ o /reel/{id}/
    if (u.hostname.includes('instagram.com')) {
      const m = u.pathname.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      if (m) return { platform: 'instagram', id: m[2] };
    }

    // Twitter / X
    if (u.hostname.includes('twitter.com') || u.hostname.includes('x.com')) {
      const m = u.pathname.match(/\/status\/(\d+)/);
      if (m) return { platform: 'twitter', id: m[1] };
    }

    // Facebook
    if (u.hostname.includes('facebook.com')) {
      return { platform: 'facebook', rawUrl: url.trim() };
    }

    return null;
  } catch { return null; }
}

function getEmbedUrl(info) {
  if (!info) return null;
  switch (info.platform) {
    case 'instagram':
      return `https://www.instagram.com/p/${info.id}/embed/captioned/`;
    case 'twitter':
      return `https://platform.twitter.com/embed/Tweet.html?id=${info.id}&theme=dark&lang=es`;
    case 'facebook':
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(info.rawUrl)}&width=500&show_text=true&lazy=true`;
    default:
      return null;
  }
}

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  facebook: 'Facebook',
};

const HEIGHTS = {
  instagram: 540,
  twitter: 420,
  facebook: 360,
};

export function SocialEmbedBlock({ section, isAdmin, onUpdate }) {
  const [inputVal, setInputVal] = useState(section.url || '');
  const info = parseSocialUrl(section.url);
  const embedUrl = getEmbedUrl(info);

  const handleApply = () => {
    onUpdate('url', inputVal.trim());
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-4">

      {/* Input de URL — solo en modo admin */}
      {isAdmin && (
        <div className="mb-4 flex gap-2">
          <input
            type="url"
            placeholder="Pegá el link del post (Instagram, X/Twitter, Facebook)..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleApply(); }}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400/60 placeholder:text-white/25"
            style={{ color: 'white' }}
          />
          <button
            onClick={handleApply}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Mostrar
          </button>
        </div>
      )}

      {/* Embed */}
      {embedUrl ? (
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white/5 border border-white/10">
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="w-full"
            style={{ height: `${HEIGHTS[info?.platform] || 480}px`, border: 'none' }}
            frameBorder="0"
            scrolling="no"
            allowTransparency="true"
            loading="lazy"
            title={`Post de ${PLATFORM_LABELS[info?.platform] || 'redes sociales'}`}
          />
        </div>
      ) : section.url ? (
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-white/40 text-sm mb-3">No se puede previsualizar este enlace</p>
          <a
            href={section.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-indigo-400 hover:text-indigo-300 text-sm underline break-all"
          >
            {section.url}
          </a>
          <p className="text-white/25 text-xs mt-3">
            Compatible con Instagram, X/Twitter y Facebook
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl p-8 text-center text-white/30">
          <div className="text-3xl mb-3">🔗</div>
          <p className="text-sm">
            {isAdmin
              ? 'Pegá el link de un post de Instagram, X/Twitter o Facebook'
              : 'Publicación de redes sociales'}
          </p>
        </div>
      )}
    </div>
  );
}
