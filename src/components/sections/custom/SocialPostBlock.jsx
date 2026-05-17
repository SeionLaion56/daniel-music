import { EditableText } from '../../ui/EditableText';
import { EditableImage } from '../../ui/EditableImage';

const PLATFORMS = {
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  x: {
    label: 'X / Twitter',
    color: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
};

export function SocialPostBlock({ section, isAdmin, onUpdate }) {
  const platform = PLATFORMS[section.platform ?? 'instagram'];
  const username = section.username || '@usuario';
  const postDate = section.date || 'hace 2 días';
  const likes    = section.likes || '0';
  const comments = section.comments || '0';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-4">
      <div className="glass rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">

        {/* Header del post */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="relative">
            <EditableImage
              src={section.avatar}
              onChange={url => onUpdate('avatar', url)}
              isAdmin={isAdmin}
              alt={username}
              className="w-10 h-10 rounded-full object-cover"
              placeholder={
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {username.replace('@', '').charAt(0).toUpperCase()}
                </div>
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <EditableText
              value={username}
              onChange={v => onUpdate('username', v)}
              isAdmin={isAdmin}
              tag="p"
              className="text-white font-semibold text-sm truncate"
            />
            <p className="text-white/40 text-xs">{postDate}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" style={{ color: platform.color }}>
            {platform.icon}
            {isAdmin && (
              <select
                value={section.platform ?? 'instagram'}
                onChange={e => onUpdate('platform', e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer"
                style={{ color: platform.color }}
              >
                {Object.entries(PLATFORMS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-gray-900 text-white">{v.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Imagen del post */}
        {(section.image || isAdmin) && (
          <EditableImage
            src={section.image}
            onChange={url => onUpdate('image', url)}
            isAdmin={isAdmin}
            alt="Post"
            className="w-full max-h-72 object-cover"
            placeholder={
              <div className="w-full h-40 bg-white/10 border-b border-white/10 flex items-center justify-center text-white/30 text-sm">
                {isAdmin ? '+ Imagen del post (opcional)' : ''}
              </div>
            }
          />
        )}

        {/* Texto del post */}
        <div className="p-4">
          <EditableText
            value={section.text || 'Texto del post...'}
            onChange={v => onUpdate('text', v)}
            isAdmin={isAdmin}
            tag="p"
            className="text-white/80 text-sm leading-relaxed"
            multiline
            textStyle={section.textStyle ?? {}}
            onStyleChange={s => onUpdate('textStyle', s)}
          />
        </div>

        {/* Footer: likes y comentarios */}
        <div className="flex items-center gap-4 px-4 pb-4 text-white/40 text-xs">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {isAdmin ? (
              <input type="number" min="0" value={likes} onChange={e => onUpdate('likes', e.target.value)}
                className="w-10 bg-transparent outline-none text-xs text-white/40" />
            ) : <span>{likes}</span>}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            {isAdmin ? (
              <input type="number" min="0" value={comments} onChange={e => onUpdate('comments', e.target.value)}
                className="w-10 bg-transparent outline-none text-xs text-white/40" />
            ) : <span>{comments}</span>}
          </div>
          {isAdmin && (
            <input type="text" placeholder="hace 2 días" value={postDate}
              onChange={e => onUpdate('date', e.target.value)}
              className="ml-auto bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-white/40 outline-none w-24" />
          )}
        </div>
      </div>
    </div>
  );
}
