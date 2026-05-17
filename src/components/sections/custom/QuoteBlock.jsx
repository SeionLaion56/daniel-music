import { EditableText } from '../../ui/EditableText';

export function QuoteBlock({ section, isAdmin, onUpdate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center relative">
        <div className="text-5xl sm:text-6xl text-white/20 font-serif leading-none mb-4 select-none">"</div>
        <EditableText
          value={section.quote || 'Escribí tu cita destacada aquí...'}
          onChange={v => onUpdate('quote', v)}
          isAdmin={isAdmin}
          tag="p"
          className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed italic font-light"
          multiline
          textStyle={section.quoteStyle ?? {}}
          onStyleChange={s => onUpdate('quoteStyle', s)}
        />
        {(section.author || isAdmin) && (
          <div className="mt-5">
            <EditableText
              value={section.author || '— Autor'}
              onChange={v => onUpdate('author', v)}
              isAdmin={isAdmin}
              tag="p"
              className="text-white/50 text-sm font-medium"
              textStyle={section.authorStyle ?? {}}
              onStyleChange={s => onUpdate('authorStyle', s)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
