'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
}

export default function CompareSlider({ beforeSrc, afterSrc, alt }: Props) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    // Sync all components by using a standard interval
    const interval = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, 3500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square select-none overflow-hidden rounded-2xl bg-slate-50 shadow-inner border border-gray-200">
      {/* Before Image */}
      <img 
        src={beforeSrc} 
        alt={alt ?? 'Before'} 
        className="absolute inset-0 h-full w-full object-contain object-center p-4" 
      />

      {/* After Image (Top-left diagonal wipe reveal) */}
      <img 
        src={afterSrc} 
        alt={alt ?? 'After'} 
        className="absolute inset-0 h-full w-full object-contain object-center p-4 transition-all duration-[2000ms] ease-in-out"
        style={{
          clipPath: showAfter 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)'   
        }}
      />
      
      {/* Context Badge */}
      <div className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-900/70 px-2 py-1 text-[10px] font-bold tracking-widest text-white backdrop-blur-md uppercase transition-all duration-500">
        {showAfter ? 'After' : 'Before'}
      </div>
    </div>
  );
}