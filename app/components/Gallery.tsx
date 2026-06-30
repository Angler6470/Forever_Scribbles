import React from 'react';

export default function Gallery() {
  return (
    <section id="gallery" className="w-full max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-10 text-slate-900">Gallery</h2>
      
      {/* Masonry layout: Columns adjust based on screen size */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="break-inside-avoid bg-slate-100 rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className={`w-full bg-slate-200 rounded-lg ${i % 3 === 0 ? 'h-64' : i % 2 === 0 ? 'h-48' : 'h-80'}`} />
          </div>
        ))}
      </div>
    </section>
  );
}