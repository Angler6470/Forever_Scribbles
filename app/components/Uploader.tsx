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
      
      // Force result to be a string
      setResult(String(json.result));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Create a Coloring Page</h2>
          <input type="file" onChange={handleUpload} accept="image/*" />
        </div>
        <div className="relative min-h-[300px] bg-slate-50 border-2 border-dashed flex items-center justify-center overflow-hidden">
          {loading ? <p>Making Magic...</p> : result ? (
            <img src={result} alt="Result" className="max-h-[500px] object-contain" />
          ) : selectedImage ? (
            <img src={selectedImage} alt="Preview" className="max-h-[500px] object-contain opacity-60" />
          ) : <p>Upload an image</p>}
        </div>
      </div>
    </div>
  );
}