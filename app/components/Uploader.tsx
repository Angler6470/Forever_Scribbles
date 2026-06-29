"use client";
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'forever-scribbles-free-uploads';
const FREE_LIMIT = 3;

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [freeUsage, setFreeUsage] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setFreeUsage(Number(stored) || 0);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedImage(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (e) {
        // If it fails to parse, it means the server sent HTML (a crash)
        console.error("Server returned non-JSON:", responseText);
        throw new Error("Server error: Check Vercel logs.");
      }

      if (!response.ok) throw new Error(json.error || 'Generation failed');

      setResult(Array.isArray(json.result) ? json.result[0] : json.result);
      
      const nextUsage = freeUsage + 1;
      setFreeUsage(nextUsage);
      localStorage.setItem(STORAGE_KEY, String(nextUsage));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Upload your doodle</h2>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={loading} className="mb-4" />
      
      {loading && <p className="text-blue-600 font-bold animate-pulse">Making The Magic... ✨</p>}
      {error && <p className="text-red-600 mt-2 font-medium">Error: {error}</p>}

      {result && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Your Coloring Page:</h3>
          <img src={result} alt="Generated" className="w-full rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}