import { EditableImage } from '../../ui/EditableImage';
import { EditableText } from '../../ui/EditableText';

export function ImageBlock({ section, isAdmin, onUpdate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <EditableImage
        src={section.image}
        onChange={url => onUpdate('image', url)}
        isAdmin={isAdmin}
        alt={section.caption || ''}
        className="w-full max-h-96 object-cover rounded-xl shadow-xl"
        placeholder={
          <div className="w-full h-56 rounded-xl bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-sm">
            {isAdmin ? '+ Agregar imagen' : ''}
          </div>
        }
      />
      {(section.caption || isAdmin) && (
        <div className="mt-3 text-center">
          <EditableText
            value={section.caption || 'Pie de foto...'}
            onChange={v => onUpdate('caption', v)}
            isAdmin={isAdmin}
            tag="p"
            className="text-white/50 text-sm italic"
            textStyle={section.captionStyle ?? {}}
            onStyleChange={s => onUpdate('captionStyle', s)}
          />
        </div>
      )}
    </div>
  );
}
