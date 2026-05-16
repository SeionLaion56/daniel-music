import { EditableText } from '../ui/EditableText';
import { EditableImage } from '../ui/EditableImage';

const SPACING = { compact: 'py-8', normal: 'py-16', spacious: 'py-28' };

export function AboutSection({ about, isAdmin, onUpdate, spacing = 'normal' }) {
  return (
    <section className={`px-6 ${SPACING[spacing]}`}>
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row gap-10 items-center">

          <div className="w-full sm:w-72 shrink-0">
            <EditableImage
              src={about.image}
              onChange={url => onUpdate(['about', 'image'], url)}
              isAdmin={isAdmin}
              alt="Foto de Daniel"
              className="w-full h-80 object-cover rounded-xl shadow-xl"
              placeholder={
                <div className="w-full h-80 rounded-xl bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-sm">
                  {isAdmin ? '+ Agregar foto' : ''}
                </div>
              }
            />
          </div>

          <div className="flex-1">
            <EditableText
              value={about.title}
              onChange={v => onUpdate(['about', 'title'], v)}
              isAdmin={isAdmin}
              tag="h3"
              className="text-3xl font-bold text-white mb-5"
              textStyle={about.titleStyle}
              onStyleChange={s => onUpdate(['about', 'titleStyle'], s)}
            />
            <EditableText
              value={about.text}
              onChange={v => onUpdate(['about', 'text'], v)}
              isAdmin={isAdmin}
              tag="p"
              className="text-white/70 leading-relaxed text-lg"
              multiline
              textStyle={about.textStyle}
              onStyleChange={s => onUpdate(['about', 'textStyle'], s)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
