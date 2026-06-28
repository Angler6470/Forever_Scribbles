import Image from 'next/image';
import CompareSlider from './components/CompareSlider';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center border-b border-gray-200">
        <Image src="/logo.png" alt="Forever Scribbles" width={150} height={50} className="h-12 w-auto" />
        <nav className="space-x-6 font-bold">
          <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
          <a href="#examples" className="hover:text-blue-600">Gallery</a>
          <a href="#faq" className="hover:text-blue-600">FAQ</a>
        </nav>
      </header>

      {/* Hero Section (Centered with 3-Column Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-12">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Your child's drawings, made into coloring book pages.
          </h1>
          <p className="text-xl text-gray-600">
            We turn your kid's exact drawings into black-and-white coloring pages—flaws, squiggles, and all.
          </p>
          <a href="#upload" className="inline-block bg-blue-600 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
            Start Creating
          </a>
        </div>
        
        {/* Inlined 3-Column Sliders with Staggered Delays */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
           <CompareSlider beforeSrc="/1_before.png" afterSrc="/1_after.png" />
           <CompareSlider beforeSrc="/2_before.png" afterSrc="/2_after.png" />
           <CompareSlider beforeSrc="/3_before.png" afterSrc="/3_after.png" />
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Three Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-600">
              <h3 className="text-2xl font-bold mb-4">1. Snap & Upload</h3>
              <p className="text-gray-600">Take a quick photo of your child's messy doodle and drop it here.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-red-500">
              <h3 className="text-2xl font-bold mb-4">2. The AI Magic</h3>
              <p className="text-gray-600">We instantly strip away the noise, leaving a perfect, uniform outline.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-yellow-400">
              <h3 className="text-2xl font-bold mb-4">3. Print & Color</h3>
              <p className="text-gray-600">Download your crisp new coloring page and grab the crayons.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to rescue a doodle?</h2>
        <div className="border-4 border-dashed border-blue-600 bg-blue-50 rounded-3xl p-16">
          <p className="text-2xl font-bold text-blue-800 mb-4">Drag & Drop a Drawing Here</p>
          <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700">
            Choose a File
          </button>
        </div>
      </section>
    </main>
  );
}