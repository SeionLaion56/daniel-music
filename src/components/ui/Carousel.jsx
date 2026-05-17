import { useState, useRef, useEffect, useCallback } from 'react';

const PEEK = 38; // px visibles de cada item adyacente
const GAP  = 14; // px entre items

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function Carousel({ items, renderItem, emptyMessage = 'Sin elementos', className = '' }) {
  const [current, setCurrent]   = useState(0);
  const [containerW, setW]      = useState(0);
  const [ready, setReady]       = useState(false);
  const sentinelRef             = useRef(null);
  const total                   = items.length;

  // Medir el ancho real del contenedor con ResizeObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setW(entry.contentRect.width);
      setReady(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const itemWidth  = Math.max(containerW - PEEK * 2, 80);
  const translateX = PEEK - current * (itemWidth + GAP);

  const goTo = useCallback((idx) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  if (total === 0) return (
    <div className={`flex items-center justify-center py-12 text-white/30 text-sm ${className}`}>
      {emptyMessage}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Sentinel invisible para medir el ancho */}
      <div ref={sentinelRef} className="absolute inset-x-0 top-0 h-px pointer-events-none" aria-hidden />

      {/* Track deslizable */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: ready ? `translateX(${translateX}px)` : 'none',
            transition: ready ? 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            opacity: ready ? 1 : 0,
          }}
        >
          {items.map((item, i) => {
            const isActive = i === current;
            return (
              <div
                key={item.id ?? i}
                className="shrink-0"
                style={{
                  width: `${itemWidth}px`,
                  transition: 'opacity 350ms ease, transform 350ms ease',
                  opacity: isActive ? 1 : 0.38,
                  transform: isActive ? 'scale(1)' : 'scale(0.92)',
                  cursor: isActive ? 'default' : 'pointer',
                }}
                onClick={() => !isActive && goTo(i)}
              >
                {renderItem(item, i, isActive)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-0.5 top-[42%] -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-sm shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-0.5 top-[42%] -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-sm shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Siguiente"
          >
            <ChevronRight />
          </button>

          {/* Indicadores dot */}
          <div className="flex justify-center items-center gap-1.5 mt-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Elemento ${i + 1}`}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === current ? '20px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
