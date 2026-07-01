"use client";
import React, { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // This function enhances contrast to lock in lines and remove background noise
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

        // Contrast adjustment factor (1.5 = stronger contrast to make pencil marks black)
        const contrast = 1.5; 
        const factor = (259 * (contrast + 1)) / (255 * (1 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          // Boost contrast on R, G, and B
          for (let j = 0; j < 3; j++) {
            data[i + j] = factor * (data[i + j] - 128) + 128;
            // Clamp values between 0-255
            if (data[i + j] > 255) data[i + j] = 255;
            if (data[i + j] < 0) data[i + j] = 0;
          }
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
      // Clean/Enhance the image locally before upload
      const processedBlob = await processImage(file);

      const formData = new FormData();
      formData.append('image', processedBlob, 'processed.png');

      const response = await fetch('/api/generate', { method: 'POST', body: formData });
      const json = await response.json();

      if (!response.ok) throw new Error(json.error || 'Generation failed');

      setResult(String(json.result));
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center items-start">
          <h2 className="text-3xl font-bold mb-4">Create a Coloring Page</h2>
          <p className="text-slate-600 mb-6">Upload a drawing, and we'll turn it into a clean, printable line-art page.</p>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
            Select Your Drawing
          </label>
          <input id="file-upload" type="file" onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        <div className="relative min-h-[300px] border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl flex items-center justify-center p-1">
          {loading && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl flex items-center justify-center font-bold animate-pulse">
              Cleaning & Transforming...
            </div>
          )}
          
          <div className="w-full h-full min-h-[290px] flex items-center justify-center">
            {loading ? null : result ? (
                <div className="text-center p-4">
                    <img src={result} className="max-h-[500px] rounded-lg shadow-md mb-4" alt="Result" />
                    <a href={result} download="coloring-page.png" className="block text-blue-600 font-bold hover:underline">Download Page</a>
                </div>
            ) : selectedImage ? (
                <img src={selectedImage} className="max-h-[500px] opacity-40" alt="Preview" />
            ) : (
                <p className="text-slate-400">Upload to see result</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}