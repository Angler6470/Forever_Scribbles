'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseConfig';

export default function Uploader() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage Bucket 'user-uploads'
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      alert(`Upload Success! Link: ${publicUrlData.publicUrl}`);
      console.log("File URL:", publicUrlData.publicUrl);

    } catch (error) {
      alert('Error uploading file!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div id="upload" className="max-w-xl mx-auto p-8 bg-white border border-slate-200 rounded-2xl my-12">
      <h2 className="text-2xl font-bold mb-4">Upload your doodle</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
      {uploading && <p className="mt-4 text-blue-600 font-bold">Uploading...</p>}
    </div>
  );
}