'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
}

export default function CompareSlider({ beforeSrc, afterSrc, alt }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const [percent, setPercent] = useState(50);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let p = (x / rect.width) * 100;
      if (p < 0) p = 0;
      if (p > 100) p = 100;
      setPercent(p);
    }

    function onPointerUp() {
      dragging.current = false;
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  function startDrag(e: React.PointerEvent) {
    dragging.current = true;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  }

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden rounded-[1.25rem] bg-slate-100">
      <img src={beforeSrc} alt={alt ?? 'Before'} className="absolute inset-0 h-full w-full object-contain" />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
        <img src={afterSrc} alt={alt ?? 'After'} className="h-full w-full object-contain" />
      </div>

      <div
        role="slider"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={startDrag}
        className="absolute top-0 bottom-0 z-10 flex items-center justify-center cursor-ew-resize"
        style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/90 bg-[#0f5bff] ring-4 ring-[#0f5bff]/20">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
