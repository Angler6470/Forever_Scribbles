"use client";
import React, { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const processImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple grayscale and high contrast boost
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722);
          const val = avg > 120 ? 255 : 0; 
          data[i] = data[i + 1] = data[i + 2] = val;
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      };
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);

    try {
      const processedBlob = await processImage(file);
      const formData = new FormData();
      formData.append('image', processedBlob, 'processed.png');

      const response = await fetch('/api/generate', { method: 'POST', body: formData });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Generation failed');
      setResult(String(json.result));
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong, but we'll get it!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center items-start">
          <h2 className="text-3xl font-bold mb-4">Create a Coloring Page</h2>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
            Select Your Drawing
          </label>
          <input id="file-upload" type="file" onChange={handleUpload} className="hidden" accept="image/*" />
        </div>
        <div className="relative min-h-[300px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-1">
          {loading ? (
            <p className="font-bold animate-pulse text-blue-600">Tracing your elephant...</p>
          ) : result ? (
            <div className="text-center">
              <img src={result} className="max-h-[500px] mb-4" alt="Result" />
              <a href={result} download="coloring-page.png" className="text-blue-600 font-bold hover:underline">Download</a>
            </div>
          ) : (
            <p className="text-slate-400">Upload to see result</p>
          )}
        </div>
      </div>
    </div>
  );
}