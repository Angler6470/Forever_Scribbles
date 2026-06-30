export default function Footer() {
  return (
    <footer className="relative bg-black text-white py-12 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-bold text-lg">© 2026 Forever Scribbles</p>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>

      <style jsx>{`
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 4s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </footer>
  );
}