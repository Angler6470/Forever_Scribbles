"use client";
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'forever-scribbles-free-uploads';
const FREE_LIMIT = 3;

function getFreeUsage() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(stored);

  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [freeUsage, setFreeUsage] = useState(0);

  useEffect(() => {
    setFreeUsage(getFreeUsage());
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }

    if (freeUsage >= FREE_LIMIT) {
      setError('You have reached your 3 free image generations. Upgrade to create more.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', 'Turn this into a crisp, clean coloring book page outline. Black and white only.');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.result) {
        throw new Error(json.error || 'Generation failed.');
      }

      setResult(json.result);

      const nextUsage = freeUsage + 1;
      setFreeUsage(nextUsage);
      window.localStorage.setItem(STORAGE_KEY, String(nextUsage));
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating your image.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const remaining = Math.max(0, FREE_LIMIT - freeUsage);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold text-slate-700">Upload a doodle and turn it into a coloring page.</p>
        <p className="text-sm text-slate-500">Free generations left: {remaining}/{FREE_LIMIT}</p>
      </div>

      {loading ? (
        <div className="text-xl font-bold animate-pulse">Making The Magic</div>
      ) : (
        <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
      )}

      {selectedImage && !loading && (
        <div className="mt-3 mb-4 flex flex-col items-center">
          <p className="mb-2 text-sm font-medium text-slate-600">Selected image</p>
          <img src={selectedImage} alt="Selected upload" className="max-w-xs rounded-lg border border-slate-200 shadow-sm" />
        </div>
      )}

      {error && <div className="mt-2 max-w-md text-center text-red-500">{error}</div>}

      {result && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="mb-2 text-lg font-semibold">Your Coloring Page:</h3>
          <img src={result} alt="Generated coloring page" className="max-w-md rounded-lg border border-gray-300 shadow-lg" />
        </div>
      )}
    </div>
  );
}