import { useState } from 'react';

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

export function Carousel({ items, renderItem, className = '', emptyMessage = 'Sin elementos' }) {
  const [current, setCurrent] = useState(0);
  const total = items.length;

  if (total === 0) return (
    <div className={`flex items-center justify-center py-12 text-white/30 text-sm ${className}`}>
      {emptyMessage}
    </div>
  );

  const goTo = (index) => {
    const clamped = ((index % total) + total) % total;
    setCurrent(clamped);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Track deslizable */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-350 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={item.id ?? i} className="w-full shrink-0">
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {/* Flechas — solo si hay más de 1 elemento */}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Siguiente"
          >
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir al elemento ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === current
                    ? 'w-5 h-2 bg-white'
                    : 'w-2 h-2 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
