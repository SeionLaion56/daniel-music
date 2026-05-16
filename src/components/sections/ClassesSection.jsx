import { EditableText } from '../ui/EditableText';
import { EditableImage } from '../ui/EditableImage';

const SPACING = { compact: 'py-8', normal: 'py-16', spacious: 'py-28' };

export function ClassesSection({ classes, classesTitle, classesTitleStyle, isAdmin, onUpdate, spacing = 'normal' }) {

  const handleAddClass = () => {
    const newClass = {
      id: Date.now(),
      title: 'Nueva Clase',
      titleStyle: {},
      description: 'Agrega aquí la descripción de esta clase.',
      descriptionStyle: {},
      image: null,
    };
    onUpdate(['classes'], [...classes, newClass]);
  };

  const handleRemoveClass = (index) => {
    onUpdate(['classes'], classes.filter((_, i) => i !== index));
  };

  // 1 clase → centrada. 2+ → grid de 2 columnas
  const gridClass = classes.length === 1
    ? 'flex justify-center'
    : 'grid grid-cols-1 sm:grid-cols-2';

  return (
    <section className={`px-6 ${SPACING[spacing]}`}>
      <div className="max-w-5xl mx-auto">
        <EditableText
          value={classesTitle || 'Clases'}
          onChange={v => onUpdate(['classesTitle'], v)}
          isAdmin={isAdmin}
          tag="h3"
          className="text-3xl font-bold text-white text-center mb-12"
          textStyle={classesTitleStyle ?? {}}
          onStyleChange={s => onUpdate(['classesTitleStyle'], s)}
        />

        <div className={`${gridClass} gap-6`}>
          {classes.map((cls, i) => (
            <div
              key={cls.id}
              className={`glass rounded-2xl overflow-hidden shadow-xl flex flex-col relative${classes.length === 1 ? ' w-full max-w-lg' : ''}`}
            >
              {/* Botón eliminar */}
              {isAdmin && (
                <button
                  onClick={() => handleRemoveClass(i)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-600/80 hover:bg-red-500 text-white text-sm flex items-center justify-center transition-colors shadow-lg"
                  title="Eliminar clase"
                >
                  ×
                </button>
              )}

              <EditableImage
                src={cls.image}
                onChange={url => onUpdate(['classes', i, 'image'], url)}
                isAdmin={isAdmin}
                alt={cls.title}
                className="w-full h-52 object-cover"
                placeholder={
                  <div className="w-full h-52 bg-white/10 border-b border-white/10 flex items-center justify-center text-white/30 text-sm">
                    {isAdmin ? '+ Agregar imagen' : ''}
                  </div>
                }
              />

              <div className="p-6 flex-1 flex flex-col">
                <EditableText
                  value={cls.title}
                  onChange={v => onUpdate(['classes', i, 'title'], v)}
                  isAdmin={isAdmin}
                  tag="h4"
                  className="text-xl font-bold text-white mb-3"
                  textStyle={cls.titleStyle}
                  onStyleChange={s => onUpdate(['classes', i, 'titleStyle'], s)}
                />
                <EditableText
                  value={cls.description}
                  onChange={v => onUpdate(['classes', i, 'description'], v)}
                  isAdmin={isAdmin}
                  tag="p"
                  className="text-white/60 leading-relaxed flex-1"
                  multiline
                  textStyle={cls.descriptionStyle}
                  onStyleChange={s => onUpdate(['classes', i, 'descriptionStyle'], s)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botón agregar — siempre separado y centrado */}
        {isAdmin && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAddClass}
              className="glass border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 flex items-center gap-3 px-10 py-5 rounded-2xl text-white/40 hover:text-white/70 transition-all"
            >
              <span className="text-3xl font-thin leading-none">+</span>
              <span className="text-sm font-medium">Agregar clase</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
