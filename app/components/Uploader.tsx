"use client";
import React, { useEffect, useState, useRef } from 'react';

const STORAGE_KEY = 'forever-scribbles-free-uploads';
const FREE_LIMIT = 3;

function getFreeUsage() {
  if (typeof window === 'undefined') return 0;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return Number.isFinite(Number(stored)) ? Number(stored) : 0;
}

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [freeUsage, setFreeUsage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFreeUsage(getFreeUsage());
  }, []);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }
    if (freeUsage >= FREE_LIMIT) {
      setError('You have reached your 3 free image generations.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedImage(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', 'A black and white coloring book page outline of the uploaded image, clean lines, high contrast, no shading.');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Generation failed.');
      
      setResult(Array.isArray(json.result) ? json.result[0] : json.result);
      const nextUsage = freeUsage + 1;
      setFreeUsage(nextUsage);
      window.localStorage.setItem(STORAGE_KEY, String(nextUsage));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Left Side: Upload Controls */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create a Coloring Page</h2>
          <p className="text-slate-500 mb-8">Transform your child's drawing into high-quality line art in seconds.</p>
          
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" accept="image/*" />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Select Artwork"}
          </button>
          
          <p className="text-xs text-slate-400 mt-4 text-center">Free generations left: {FREE_LIMIT - freeUsage}/{FREE_LIMIT}</p>
        </div>

        {/* Right Side: Preview & Output */}
        <div className="relative min-h-[300px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="text-center p-6">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-semibold text-blue-600">Magic in progress...</p>
            </div>
          ) : result ? (
            <img src={result} alt="Result" className="w-full h-full object-contain p-2" />
          ) : selectedImage ? (
            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain p-2 opacity-60" />
          ) : (
            <p className="text-slate-400 text-sm">Upload an image to see the result</p>
          )}
        </div>
      </div>
      
      {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">{error}</div>}
    </div>
  );
}