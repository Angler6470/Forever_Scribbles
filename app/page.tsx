import Image from 'next/image';
import CompareSlider from './components/CompareSlider';
import FAQAccordion from './components/FAQAccordion';
import Uploader from './components/Uploader';
import { supabase } from '@/lib/supabaseClient'; // Added import

export default function Home() {
  
  // Temporary test code for Supabase connection
  const testSupabase = async () => {
    console.log("Supabase test starting..."); // Check if this prints
    const { data, error } = await supabase.from('profiles').select('*');
    console.log('Database Result:', data, error);
  };
  testSupabase(); 

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white pt-8 pb-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
          <img src="/logo.png" alt="Forever Scribbles" className="h-32 w-auto object-contain mb-6" />
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#hero" className="hover:text-blue-600">Home</a>
            <a href="#how-it-works" className="hover:text-blue-600">How it works</a>
            <a href="#gallery" className="hover:text-blue-600">Gallery</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero Section (Centered with 3-Column Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-12">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Your child's art, forever.
          </h1>
          <p className="text-xl text-gray-600">
            We turn every doodle, scribble, and squiggle into a crisp, printable coloring page you can cherish forever.
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
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default">
              <h3 className="text-2xl font-bold mb-4">1. Capture the Masterpiece</h3>
              <p className="text-gray-600">Take a quick photo of your child's messy doodle and drop it here.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-red-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default">
              <h3 className="text-2xl font-bold mb-4">2. Watch the Transformation</h3>
              <p className="text-gray-600">We instantly strip away the noise, leaving a perfect, uniform outline.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-yellow-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default">
              <h3 className="text-2xl font-bold mb-4">3. Print & Color</h3>
              <p className="text-gray-600">Download your crisp new coloring page and grab the crayons.</p>
            </div>
          </div>
        </div>
      </section>

      <Uploader />

      <FAQAccordion />
    </main>
  );
}