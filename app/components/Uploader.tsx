"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseConfig';

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
      // 1. Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 2. Upload to your existing 'user-uploads' bucket
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 4. Send to your API
      const promptText = "Turn this into a crisp, clean coloring book page outline. Black and white only.";
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageUrl,
          prompt: promptText
        }),
      });

      const json = await response.json();

      // 5. Display the result
      if (response.ok && json.result) {
        const finalImageUrl = Array.isArray(json.result) ? json.result[0] : json.result;
        setResult(finalImageUrl);
      } else {
        throw new Error(json.error || "Generation failed.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
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