'use client'; 

import CompareSlider from './components/CompareSlider';
import FAQAccordion from './components/FAQAccordion';
import Uploader from './components/Uploader';
import ContactForm from './components/ContactForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white pt-8 pb-4 sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
          <a href="/" className="inline-block transition-transform duration-500 hover:rotate-180 mb-6">
            <img src="/logo.png" alt="Forever Scribbles" className="h-32 w-auto object-contain" />
          </a>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#hero" className="hover:text-blue-600">Home</a>
            <a href="#how-it-works" className="hover:text-blue-600">How it works</a>
            <a href="#upload" className="hover:text-blue-600">Create</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-12">
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
        
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
           <CompareSlider beforeSrc="/1_before.png" afterSrc="/1_after.png" />
           <CompareSlider beforeSrc="/2_before.png" afterSrc="/2_after.png" />
           <CompareSlider beforeSrc="/3_before.png" afterSrc="/3_after.png" />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Three Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-2xl font-bold mb-4">1. Capture</h3>
              <p className="text-gray-600">Take a photo of the doodle and drop it here.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-red-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-2xl font-bold mb-4">2. Transform</h3>
              <p className="text-gray-600">We instantly strip the noise and create an outline.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-yellow-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-2xl font-bold mb-4">3. Print</h3>
              <p className="text-gray-600">Download your page and start coloring.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="bg-white py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <Uploader />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Need help?</p>
            <h2 className="text-4xl font-bold mt-4">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />
    </main>
  );
}