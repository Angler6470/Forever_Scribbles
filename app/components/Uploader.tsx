"use client";
import React, { useState, useRef } from 'react';

const STORAGE_KEY = 'forever-scribbles-free-uploads';
const FREE_LIMIT = 3;

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [freeUsage, setFreeUsage] = useState(0);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    // Set preview immediately
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

      setResult(Array.isArray(json.result) ? json.result[0] : json.result);
      
      const nextUsage = Number(localStorage.getItem(STORAGE_KEY) || 0) + 1;
      localStorage.setItem(STORAGE_KEY, String(nextUsage));
      setFreeUsage(nextUsage);
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
          <input type="file" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="mb-4" accept="image/*" />
        </div>
        <div className="relative min-h-[300px] bg-slate-50 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
          {loading ? <p>Making Magic...</p> : (result ? <img src={result} /> : (selectedImage ? <img src={selectedImage} /> : <p>Upload an image</p>))}
        </div>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}