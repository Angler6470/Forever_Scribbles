export default function Gallery() {
  return (
    <section id="gallery" className="w-full max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-10">Recent Masterpieces</h2>
      
      {/* Tailwind's columns utility creates the masonry effect */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        
        {/* Generating 8 placeholder divs of varying heights */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`bg-slate-200 rounded-xl w-full flex items-center justify-center text-slate-400 font-bold ${
              i % 3 === 0 ? 'h-64' : i % 2 === 0 ? 'h-48' : 'h-80'
            }`}
          >
            Image {i + 1}
          </div>
        ))}
        
      </div>
    </section>
  );
}