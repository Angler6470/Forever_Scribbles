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

        // 1. Convert to Grayscale
        const gray = new Uint8Array(data.length / 4);
        for (let i = 0; i < gray.length; i++) {
          gray[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114);
        }

        // 2. Median Blur (Denoise) - This removes the tiny dots
        const denoised = new Uint8Array(gray.length);
        for (let y = 1; y < img.height - 1; y++) {
          for (let x = 1; x < img.width - 1; x++) {
            const neighbors = [
              gray[(y - 1) * img.width + (x - 1)], gray[(y - 1) * img.width + x], gray[(y - 1) * img.width + (x + 1)],
              gray[y * img.width + (x - 1)], gray[y * img.width + x], gray[y * img.width + (x + 1)],
              gray[(y + 1) * img.width + (x - 1)], gray[(y + 1) * img.width + x], gray[(y + 1) * img.width + (x + 1)]
            ];
            neighbors.sort((a, b) => a - b);
            denoised[y * img.width + x] = neighbors[4]; // Pick the median value
          }
        }

        // 3. Adaptive Threshold on the denoised image
        const output = new Uint8Array(gray.length);
        const size = 5;
        for (let y = size; y < img.height - size; y++) {
          for (let x = size; x < img.width - size; x++) {
            let sum = 0;
            for (let dy = -size; dy <= size; dy++) {
              for (let dx = -size; dx <= size; dx++) {
                sum += denoised[(y + dy) * img.width + (x + dx)];
              }
            }
            const mean = sum / ((2 * size + 1) * (2 * size + 1));
            // Offset -25 aggressively removes light noise
            output[y * img.width + x] = denoised[y * img.width + x] < mean - 25 ? 0 : 255;
          }
        }

        // Write back to canvas
        for (let i = 0; i < gray.length; i++) {
          data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = output[i];
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
          {loading && <div className="animate-pulse absolute inset-0 bg-blue-500/10 rounded-2xl flex items-center justify-center font-bold">Cleaning & Transforming...</div>}
          <div className="w-full h-full min-h-[290px] flex items-center justify-center">
            {loading ? null : result ? (
                <div className="text-center">
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