import { EditableText } from '../../ui/EditableText';

export function TextBlock({ section, isAdmin, onUpdate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <EditableText
        value={section.text || 'Escribe algo aquí...'}
        onChange={v => onUpdate('text', v)}
        isAdmin={isAdmin}
        tag="p"
        className="text-white/80 leading-relaxed text-base sm:text-lg"
        multiline
        textStyle={section.textStyle ?? {}}
        onStyleChange={s => onUpdate('textStyle', s)}
      />
    </div>
  );
}
