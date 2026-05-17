// Controles de reordenamiento — aparecen para TODAS las secciones en modo admin
export function SectionWrapper({
  index, total, isAdmin, isCustom,
  onMoveUp, onMoveDown, onDelete,
  children,
}) {
  if (!isAdmin) return <>{children}</>;

  return (
    <div className="relative group/section">
      {/* Controles flotantes sobre la sección */}
      <div className="absolute top-2 right-3 z-20 flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900/80 hover:bg-gray-800 border border-white/20 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm backdrop-blur-sm"
          title="Subir sección"
        >▲</button>
        <button
          onClick={onMoveDown}
          disabled={index >= total - 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900/80 hover:bg-gray-800 border border-white/20 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm backdrop-blur-sm"
          title="Bajar sección"
        >▼</button>
        <button
          onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-900/80 hover:bg-red-700 border border-red-500/30 text-red-400 hover:text-white transition-all text-sm backdrop-blur-sm"
          title={isCustom ? 'Eliminar sección' : 'Ocultar sección'}
        >×</button>
      </div>

      {/* Indicador de sección activa en modo edición */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover/section:ring-white/10 rounded-lg transition-all pointer-events-none" />

      {children}
    </div>
  );
}
