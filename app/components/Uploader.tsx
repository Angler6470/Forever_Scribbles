"use client";
import React, { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // This function cleans the image before sending it to the API
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

        // Thresholding Logic: Make it pure black and white
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const val = avg > 120 ? 255 : 0; // Adjust 120 to change sensitivity
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

    // Show preview immediately
    setSelectedImage(URL.createObjectURL(file));

    setLoading(true);
    setResult(null);

    try {
      // Clean the image first
      const processedBlob = await processImage(file);
      
      const formData = new FormData();
      formData.append('image', processedBlob, 'processed.png');

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
        <div className="flex flex-col justify-center items-start">
          <h2 className="text-3xl font-bold mb-4">Create a Coloring Page</h2>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
            Select Your Drawing
          </label>
          <input id="file-upload" type="file" onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        <div className="relative min-h-[300px] border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl flex items-center justify-center p-1">
          {loading && <div className="animate-pulse absolute inset-0 bg-blue-500/10 rounded-2xl"></div>}
          <div className="w-full h-full min-h-[290px] flex items-center justify-center">
            {loading ? <p className="font-bold">Cleaning & Transforming...</p> : result ? <img src={result} className="max-h-[500px]" /> : selectedImage ? <img src={selectedImage} className="max-h-[500px] opacity-40" /> : <p className="text-slate-400">Upload to see result</p>}
          </div>
        </div>
      </div>
    </div>
  );
}