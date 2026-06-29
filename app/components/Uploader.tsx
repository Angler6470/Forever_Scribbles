"use client";
import React, { useState } from 'react';

const STORAGE_KEY = 'forever-scribbles-free-uploads';
const FREE_LIMIT = 3;

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Preview
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/generate', { method: 'POST', body: formData });
      const json = await response.json();

      if (!response.ok) throw new Error(json.error || 'Generation failed');

      // SAFETY FIX: If json.result is an object, try to extract 'url' 
      // or convert the whole thing to a string.
      const rawResult = json.result;
      const finalUrl = (typeof rawResult === 'object' && rawResult !== null) 
                       ? (rawResult.url || JSON.stringify(rawResult)) 
                       : rawResult;

      setResult(finalUrl);
      
      const nextUsage = Number(localStorage.getItem(STORAGE_KEY) || 0) + 1;
      localStorage.setItem(STORAGE_KEY, String(nextUsage));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Create a Coloring Page</h2>
          <input type="file" onChange={handleUpload} className="mb-4" accept="image/*" />
        </div>
        <div className="relative min-h-[300px] bg-slate-50 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
          {loading ? (
            <p className="text-slate-500 font-medium">Making Magic...</p>
          ) : result ? (
            // Ensure the src is a valid string URL
            <img src={result} alt="Generated Coloring Page" className="max-h-[500px] object-contain" />
          ) : selectedImage ? (
            <img src={selectedImage} alt="Preview" className="max-h-[500px] object-contain opacity-60" />
          ) : (
            <p className="text-slate-400 text-sm">Upload an image to see the result</p>
          )}
        </div>
      </div>
      {error && <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>}
    </div>
  );
}