import { useState, useRef, useEffect } from 'react';

const PEEK = 48; // px de item adyacente visibles a cada lado
const GAP  = 10; // px entre items

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

function ArrowBtn({ onClick, children, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm shadow-lg transition-all hover:scale-110 active:scale-95 self-center"
    >
      {children}
    </button>
  );
}

export function Carousel({ items, renderItem, emptyMessage = 'Sin elementos', className = '' }) {
  const [current, setCurrent] = useState(0);
  const [clipW, setClipW]     = useState(0);
  const [ready, setReady]     = useState(false);
  const clipRef               = useRef(null);
  const total                 = items.length;

  // Medir el ancho real del contenedor clip con ResizeObserver
  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setClipW(entry.contentRect.width);
      setReady(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cada item ocupa el ancho del clip menos los dos peeks
  const itemWidth  = Math.max(clipW - PEEK * 2, 60);
  // Posición del track: centra el item actual dentro del clip
  const translateX = PEEK - current * (itemWidth + GAP);

  const goTo = (idx) => {
    setCurrent(((idx % total) + total) % total);
  };

  if (total === 0) return (
    <div className={`flex items-center justify-center py-10 text-white/30 text-sm ${className}`}>
      {emptyMessage}
    </div>
  );

  return (
    <div className={`relative ${className}`}>

      {/* Fila: flecha ← | clip area | flecha → */}
      <div className="flex items-stretch gap-2">

        {/* Flecha izquierda — FUERA del clip para no tapar el peek */}
        {total > 1
          ? <ArrowBtn onClick={() => goTo(current - 1)} label="Anterior"><ChevronLeft /></ArrowBtn>
          : <div className="w-9 shrink-0" />
        }

        {/* Contenedor clip — solo este hace overflow:hidden */}
        <div ref={clipRef} className="overflow-hidden flex-1 min-w-0">
          <div
            className="flex"
            style={{
              gap: `${GAP}px`,
              transform: ready ? `translateX(${translateX}px)` : 'translateX(0)',
              transition: ready ? 'transform 380ms cubic-bezier(0.4,0,0.2,1)' : 'none',
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
                    opacity: isActive ? 1 : 0.35,
                    transform: isActive ? 'scale(1)' : 'scale(0.91)',
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

        {/* Flecha derecha — FUERA del clip */}
        {total > 1
          ? <ArrowBtn onClick={() => goTo(current + 1)} label="Siguiente"><ChevronRight /></ArrowBtn>
          : <div className="w-9 shrink-0" />
        }
      </div>

      {/* Dots debajo */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Elemento ${i + 1}`}
              style={{
                height: '8px',
                width: i === current ? '20px' : '8px',
                borderRadius: '9999px',
                backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 220ms ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
