import { EditableText } from '../../ui/EditableText';
import { EditableImage } from '../../ui/EditableImage';

export function TextImageBlock({ section, isAdmin, onUpdate }) {
  const reversed = section.reversed ?? false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className={`glass rounded-xl sm:rounded-2xl p-5 sm:p-8 flex flex-col ${reversed ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-6 sm:gap-8 items-center`}>
        <div className="w-full sm:w-80 shrink-0">
          <EditableImage
            src={section.image}
            onChange={url => onUpdate('image', url)}
            isAdmin={isAdmin}
            alt=""
            className="w-full h-52 sm:h-64 object-cover rounded-lg sm:rounded-xl shadow-lg"
            placeholder={
              <div className="w-full h-52 sm:h-64 rounded-xl bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-sm">
                {isAdmin ? '+ Imagen' : ''}
              </div>
            }
          />
          {isAdmin && (
            <button
              onClick={() => onUpdate('reversed', !reversed)}
              className="mt-2 w-full text-xs text-white/40 hover:text-white/70 py-1 border border-white/15 hover:border-white/30 rounded-lg transition-colors"
            >
              ⇄ Invertir posición
            </button>
          )}
        </div>
        <div className="flex-1 w-full">
          <EditableText
            value={section.title || 'Título'}
            onChange={v => onUpdate('title', v)}
            isAdmin={isAdmin}
            tag="h3"
            className="text-xl sm:text-2xl font-bold text-white mb-3"
            textStyle={section.titleStyle ?? {}}
            onStyleChange={s => onUpdate('titleStyle', s)}
          />
          <EditableText
            value={section.text || 'Descripción...'}
            onChange={v => onUpdate('text', v)}
            isAdmin={isAdmin}
            tag="p"
            className="text-white/70 leading-relaxed"
            multiline
            textStyle={section.textStyle ?? {}}
            onStyleChange={s => onUpdate('textStyle', s)}
          />
        </div>
      </div>
    </div>
  );
}
