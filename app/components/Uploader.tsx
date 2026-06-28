'use client';
import { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    // Convert image to base64 so we can send it in JSON
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: reader.result }),
      });
      
      const data = await response.json();
      if (data.result) setResult(data.result[0]); // Replicate returns an array
      setLoading(false);
    };
  };

  return (
    <section id="upload" className="max-w-4xl mx-auto py-24 px-6 text-center">
      <h2 className="text-4xl font-bold mb-8">Ready to rescue a doodle?</h2>
      <div className="border-4 border-dashed border-blue-600 bg-blue-50 rounded-3xl p-16 flex flex-col items-center justify-center">
        
        {!result && !loading && (
          <>
            <p className="text-2xl font-bold text-blue-800 mb-4">Select a Drawing Here</p>
            <label className="cursor-pointer bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition">
              Choose a File
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            </label>
          </>
        )}

        {loading && <p className="text-xl font-bold text-blue-600 animate-pulse">The AI is working its magic...</p>}

        {result && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-600">Success!</h3>
            <img src={result} alt="Coloring Page" className="max-h-96 rounded-xl border-2 border-slate-200" />
            <button onClick={() => setResult(null)} className="mt-4 text-blue-600 font-bold underline">
              Upload another one
            </button>
          </div>
        )}
      </div>
    </section>
  );
}