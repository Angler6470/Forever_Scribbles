"use client";
import React, { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/generate', { method: 'POST', body: formData });
      const json = await response.json();

      if (!response.ok) throw new Error(json.error || 'Generation failed');
      
      setResult(String(json.result));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Left Side: Upload Controls */}
        <div className="flex flex-col justify-center items-start">
          <h2 className="text-3xl font-bold mb-4">Create a Coloring Page</h2>
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
          >
            Select Your Drawing
          </label>
          <input 
            id="file-upload" 
            type="file" 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Right Side: Results with Animated Border */}
        <div className={`relative min-h-[300px] rounded-2xl flex items-center justify-center p-1 ${!loading ? 'border-2 border-dashed border-slate-300 bg-slate-50' : ''}`}>
          
          {loading && <div className="animate-color-border"></div>}
          
          <div className={`relative z-10 w-full h-full min-h-[290px] flex items-center justify-center rounded-xl overflow-hidden ${loading ? 'bg-slate-50' : ''}`}>
            {loading ? (
              <p className="text-slate-800 font-bold bg-white/90 px-6 py-2 rounded-lg shadow-sm backdrop-blur-sm">Making Magic...</p>
            ) : result ? (
              <img src={result} alt="Result" className="max-h-[500px] object-contain" />
            ) : selectedImage ? (
              <img src={selectedImage} alt="Preview" className="max-h-[500px] object-contain opacity-40" />
            ) : (
              <p className="text-slate-400 font-medium">Upload an image to see the result</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}