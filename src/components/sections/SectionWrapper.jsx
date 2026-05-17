import { useState } from 'react';
import { AddSectionModal } from './AddSectionModal';

// Botón + entre secciones
function AddButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex justify-center py-1">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/35 text-white/40 hover:text-white/80 text-xs font-medium transition-all"
          title="Agregar sección"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar sección
        </button>
      </div>
      {open && <AddSectionModal onAdd={onAdd} onClose={() => setOpen(false)} />}
    </>
  );
}

// Controles de reordenamiento para una sección
function ReorderControls({ onUp, onDown, onDelete, canUp, canDown }) {
  return (
    <div className="flex items-center justify-end gap-1 px-4 py-1">
      <button onClick={onUp} disabled={!canUp}
        className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/15 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm"
        title="Subir sección">▲</button>
      <button onClick={onDown} disabled={!canDown}
        className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/15 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm"
        title="Bajar sección">▼</button>
      <button onClick={onDelete}
        className="w-7 h-7 flex items-center justify-center rounded bg-red-600/20 hover:bg-red-600/40 border border-red-600/20 text-red-400 hover:text-red-300 transition-all text-sm"
        title="Eliminar sección">×</button>
    </div>
  );
}

// Wrapper que añade controles de reordenamiento + botón agregar entre secciones
export function SectionWrapper({
  sectionId, index, total, isAdmin, isCustom,
  onMoveUp, onMoveDown, onDelete, onAddAfter,
  children,
}) {
  return (
    <div className="relative">
      {isAdmin && isCustom && (
        <ReorderControls
          onUp={onMoveUp}
          onDown={onMoveDown}
          onDelete={onDelete}
          canUp={index > 0}
          canDown={index < total - 1}
        />
      )}
      {children}
      {isAdmin && (
        <AddButton onAdd={onAddAfter} />
      )}
    </div>
  );
}
