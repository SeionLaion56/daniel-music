import { useState, useRef, useEffect } from 'react';

const PEEK = 60; // px de items adyacentes visibles a cada lado
const GAP  = 12;

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function Carousel({ items, renderItem, emptyMessage = 'Sin elementos', className = '' }) {
  const [current, setCurrent] = useState(0);
  const [clipW, setClipW]     = useState(0);
  const [ready, setReady]     = useState(false);
  const clipRef               = useRef(null);
  const total                 = items.length;

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

  const itemWidth  = Math.max(clipW - PEEK * 2, 60);
  const translateX = PEEK - current * (itemWidth + GAP);

  const goTo = (idx) => setCurrent(((idx % total) + total) % total);

  if (total === 0) return (
    <div className={`flex items-center justify-center py-10 text-white/30 text-sm ${className}`}>
      {emptyMessage}
    </div>
  );

  return (
    <div className={`relative ${className}`}>

      {/* Track — usa todo el ancho */}
      <div ref={clipRef} className="overflow-hidden">
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
                  transition: 'opacity 340ms ease, transform 340ms ease',
                  opacity: isActive ? 1 : 0.32,
                  transform: isActive ? 'scale(1)' : 'scale(0.90)',
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

      {/* Botones superpuestos — absolutos, pequeños, semi-transparentes */}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Anterior"
            className="absolute left-2 top-[42%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-sm shadow-md transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Siguiente"
            className="absolute right-2 top-[42%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-sm shadow-md transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: '8px',
                  width: i === current ? '20px' : '8px',
                  borderRadius: '9999px',
                  backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 220ms ease',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
