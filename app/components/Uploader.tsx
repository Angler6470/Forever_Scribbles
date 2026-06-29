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
    <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-blue-100 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] md:p-8">
      <div className="text-center">
        <div className="mb-3 inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold text-blue-700">
          ✨ Turn doodles into keepsakes
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Bring your child&apos;s art to life
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
          Upload a sketch, photo, or scribble and we&apos;ll transform it into a polished coloring page.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Free generations left: {remaining}/{FREE_LIMIT}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-blue-300 bg-white/80 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-blue-50">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl text-white shadow-lg shadow-blue-600/20">
            ⬆
          </div>
          <span className="text-lg font-semibold text-slate-800">Choose an image</span>
          <span className="mt-2 text-sm text-slate-500">PNG, JPG, or HEIC — anything your little artist made</span>
          <span className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-700">
            Upload Image
          </span>
          <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
        </label>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-900 p-5 text-white shadow-inner">
          {loading ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/10 text-center">
              <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-white" />
              <p className="text-xl font-bold">Making The Magic</p>
              <p className="mt-2 text-sm text-slate-300">We&apos;re turning your image into something printable and beautiful.</p>
            </div>
          ) : selectedImage ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Preview</p>
              <img src={selectedImage} alt="Selected upload" className="max-h-56 w-full rounded-2xl object-contain" />
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-white/15 bg-white/5 px-4 text-center">
              <p className="text-lg font-semibold">Your masterpiece will appear here</p>
              <p className="mt-2 text-sm text-slate-300">Once uploaded, we&apos;ll preview it before generating your coloring page.</p>
            </div>
          )}
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</div>}

      {result && (
        <div className="flex flex-col items-center rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">Your Coloring Page</h3>
          <img src={result} alt="Generated coloring page" className="max-w-full rounded-[1.25rem] border border-slate-200 shadow-lg" />
        </div>
      )}
    </div>
  );
}