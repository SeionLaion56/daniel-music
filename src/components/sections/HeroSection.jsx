import { EditableText } from '../ui/EditableText';
import { EditableImage } from '../ui/EditableImage';

const SPACING = { compact: 'py-10', normal: 'py-16 sm:py-20', spacious: 'py-20 sm:py-32' };

export function HeroSection({ hero, isAdmin, onUpdate, spacing = 'normal' }) {
  return (
    <section className={`relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center px-4 sm:px-6 ${SPACING[spacing]}`}>
      <div className="max-w-4xl mx-auto text-center w-full">

        {(hero.image || isAdmin) && (
          <div className="mb-6 sm:mb-10">
            <EditableImage
              src={hero.image}
              onChange={url => onUpdate(['hero', 'image'], url)}
              isAdmin={isAdmin}
              alt="Imagen principal"
              className="w-full max-h-48 sm:max-h-72 lg:max-h-105 object-cover rounded-xl sm:rounded-2xl shadow-2xl"
              placeholder={
                <div className="w-full h-40 sm:h-64 rounded-xl sm:rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-sm">
                  + Agregar imagen principal
                </div>
              }
            />
          </div>
        )}

        <EditableText
          value={hero.title}
          onChange={v => onUpdate(['hero', 'title'], v)}
          isAdmin={isAdmin}
          tag="h2"
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          textStyle={hero.titleStyle}
          onStyleChange={s => onUpdate(['hero', 'titleStyle'], s)}
        />

        <EditableText
          value={hero.subtitle}
          onChange={v => onUpdate(['hero', 'subtitle'], v)}
          isAdmin={isAdmin}
          tag="p"
          className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          multiline
          textStyle={hero.subtitleStyle}
          onStyleChange={s => onUpdate(['hero', 'subtitleStyle'], s)}
        />
      </div>
    </section>
  );
}
