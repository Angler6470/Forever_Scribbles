"use client";
import React, { useState } from 'react';

export default function Uploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const promptText = "Turn this into a crisp, clean coloring book page outline. Black and white only.";

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image,
            prompt: promptText
          }),
        });

        const json = await response.json();

        if (response.ok && json.result) {
          const finalImageUrl = Array.isArray(json.result) ? json.result[0] : json.result;
          setResult(finalImageUrl);
        } else {
          setError(json.error || "Generation failed.");
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setLoading(false);
      };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading ? (
        <div className="text-xl font-bold animate-pulse">Making magic... ✨</div>
      ) : (
        <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
      )}

      {error && <div className="text-red-500 mt-2">Error: {error}</div>}

      {result && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Your Coloring Page:</h3>
          <img src={result} alt="Generated coloring page" className="max-w-md rounded-lg shadow-lg border border-gray-300" />
        </div>
      )}
    </div>
  );
}