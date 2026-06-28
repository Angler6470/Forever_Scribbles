'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseConfig';

export default function Uploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      // 2. Call your API to transform the image
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: publicUrlData.publicUrl }),
      });

      const json = await response.json();
      
      if (json.result) {
        setResult(json.result); // Save the output URL to state
      } else {
        throw new Error(json.error || "Generation failed");
      }
    } catch (error) {
      alert('Error processing image!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div id="upload" className="max-w-xl mx-auto p-8 bg-white border border-slate-200 rounded-2xl my-12">
      <h2 className="text-2xl font-bold mb-4">Upload your doodle</h2>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="..." />
      
      {uploading && <p className="mt-4 text-blue-600 font-bold">Transforming...</p>}

      {/* 3. Display the Result with Watermark */}
      {result && (
        <div className="mt-8 relative">
          <h3 className="font-bold mb-2">Your Coloring Page:</h3>
          <div className="relative inline-block">
            <img src={result} alt="Result" className="w-full rounded-lg" />
            {/* Watermark Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <img src="/watermark-placeholder.png" alt="Watermark" className="w-1/2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}