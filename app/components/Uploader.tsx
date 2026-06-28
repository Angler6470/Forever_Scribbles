'use client';
import { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation checks
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large! Please keep it under 5MB.');
      return;
    }

    setLoading(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        
        const data = await response.json();
        if (data.result) {
          setResult(data.result[0]);
        } else {
          setError('Conversion failed to process. Try a different drawing.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <section id="upload" className="max-w-4xl mx-auto py-24 px-6 text-center">
      <h2 className="text-4xl font-bold mb-8">Ready to convert the doodle?</h2>
      
      {/* Error Message Display */}
      {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

      <div className="border-4 border-dashed border-blue-600 bg-blue-50 rounded-3xl p-16 flex flex-col items-center justify-center">
        {!result && !loading && (
          <>
            <p className="text-2xl font-bold text-blue-800 mb-4">Select a drawing here</p>
            <label className="cursor-pointer bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition">
              Choose a File
              <input type="file" className="hidden" accept={ACCEPTED_TYPES.join(',')} onChange={handleUpload} />
            </label>
          </>
        )}

        {loading && <p className="text-xl font-bold text-blue-600 animate-pulse">We're performing the magic...</p>}

        {result && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-600">Success!</h3>
            <img src={result} alt="Coloring Page" className="max-h-96 rounded-xl border-2 border-slate-200" />
            <button onClick={() => { setResult(null); setError(null); }} className="mt-4 text-blue-600 font-bold underline">
              Upload another one
            </button>
          </div>
        )}
      </div>
    </section>
  );
}