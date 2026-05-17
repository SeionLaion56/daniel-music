import { useState } from 'react';
import { Carousel } from '../../ui/Carousel';

function parseSocialUrl(url) {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes('instagram.com')) {
      const m = u.pathname.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      if (m) return { platform: 'instagram', id: m[2] };
    }
    if (u.hostname.includes('twitter.com') || u.hostname.includes('x.com')) {
      const m = u.pathname.match(/\/status\/(\d+)/);
      if (m) return { platform: 'twitter', id: m[1] };
    }
    if (u.hostname.includes('facebook.com')) {
      return { platform: 'facebook', rawUrl: url.trim() };
    }
    return null;
  } catch { return null; }
}

function getEmbedUrl(info) {
  if (!info) return null;
  switch (info.platform) {
    case 'instagram': return `https://www.instagram.com/p/${info.id}/embed/captioned/`;
    case 'twitter':   return `https://platform.twitter.com/embed/Tweet.html?id=${info.id}&theme=dark&lang=es`;
    case 'facebook':  return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(info.rawUrl)}&width=500&show_text=true&lazy=true`;
    default:          return null;
  }
}

// Altura base del iframe por plataforma (tamaño natural del embed)
const BASE_H = { instagram: 530, twitter: 430, facebook: 370 };
const PLATFORM_LABELS = { instagram: 'Instagram', twitter: 'X / Twitter', facebook: 'Facebook' };

// Scale real: el iframe se renderiza a tamaño natural y se hace zoom con CSS
const SCALES = { sm: 0.65, md: 1.0, lg: 1.38 };
const SIZE_LABELS = { sm: 'Pequeño', md: 'Normal', lg: 'Grande' };

function EmbedItem({ url, size = 'md' }) {
  const info     = parseSocialUrl(url);
  const embedUrl = getEmbedUrl(info);
  const scale    = SCALES[size] ?? 1;
  const baseH    = BASE_H[info?.platform] ?? 460;

  if (!url) return (
    <div className="flex items-center justify-center h-36 text-white/25 text-sm rounded-xl bg-white/5">Sin URL</div>
  );

  if (!embedUrl) return (
    <div className="glass rounded-xl p-5 text-center">
      <p className="text-white/40 text-sm mb-2">No se puede previsualizar este enlace</p>
      <a href={url} target="_blank" rel="noopener noreferrer nofollow"
        className="text-indigo-400 text-xs break-all hover:underline">{url}</a>
    </div>
  );

  // El contenedor tiene la altura visual (baseH * scale)
  // El iframe se escala dentro con transform, sin que se corte el contenido
  const containerH = Math.round(baseH * scale);

  return (
    <div
      className="rounded-xl overflow-hidden shadow-2xl bg-white/5 border border-white/10"
      style={{ height: `${containerH}px` }}
    >
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        // Para que el iframe llene el ancho del contenedor tras el scale
        width: `${(100 / scale).toFixed(2)}%`,
        height: `${baseH}px`,
      }}>
        <iframe
          key={embedUrl + size}
          src={embedUrl}
          style={{ width: '100%', height: `${baseH}px`, border: 'none', display: 'block' }}
          frameBorder="0"
          scrolling="no"
          allowTransparency="true"
          loading="lazy"
          title={`Post de ${PLATFORM_LABELS[info?.platform] || 'redes'}`}
        />
      </div>
    </div>
  );
}

export function SocialEmbedBlock({ section, isAdmin, onUpdate }) {
  const [newUrl, setNewUrl] = useState('');

  const posts = section.posts
    ?? (section.url ? [{ id: Date.now(), url: section.url }] : []);
  const size = section.size ?? 'md';

  const addPost = () => {
    const url = newUrl.trim();
    if (!url) return;
    onUpdate('posts', [...posts, { id: Date.now(), url }]);
    onUpdate('url', undefined);
    setNewUrl('');
  };

  const removePost = (id) => {
    onUpdate('posts', posts.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">

      {posts.length > 0 ? (
        <>
          <Carousel
            items={posts}
            renderItem={(post) => <EmbedItem url={post.url} size={size} />}
            emptyMessage="Sin publicaciones"
          />

          {/* Control de tamaño */}
          {isAdmin && (
            <div className="flex justify-center gap-1 mt-3">
              {Object.entries(SIZE_LABELS).map(([s, label]) => (
                <button
                  key={s}
                  onClick={() => onUpdate('size', s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    size === s ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-xl p-8 text-center text-white/30">
          <div className="text-3xl mb-3">📲</div>
          <p className="text-sm">{isAdmin ? 'Agregá el link de un post' : 'Publicaciones de redes sociales'}</p>
        </div>
      )}

      {/* Panel admin */}
      {isAdmin && (
        <div className="mt-4 glass rounded-xl p-4 flex flex-col gap-3">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
            Publicaciones ({posts.length})
          </p>

          {posts.map((post, i) => (
            <div key={post.id} className="flex items-center gap-2 text-xs">
              <span className="text-white/35 shrink-0">#{i + 1}</span>
              <span className="text-white/55 truncate flex-1 min-w-0">{post.url || '—'}</span>
              <button
                onClick={() => removePost(post.id)}
                className="shrink-0 text-red-400/70 hover:text-red-400 px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
              >
                Quitar
              </button>
            </div>
          ))}

          <div className="flex gap-2 mt-1">
            <input
              type="url"
              placeholder="Link de Instagram, X/Twitter o Facebook..."
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addPost(); }}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400/60 placeholder:text-white/25 min-w-0"
              style={{ color: 'white' }}
            />
            <button
              onClick={addPost}
              className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
