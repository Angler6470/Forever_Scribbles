"use client";
import React, { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Message sent!');
  };

  return (
    <section id="contact" className="py-16 px-6 bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" required />
          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" required />
          <textarea placeholder="How can we help?" className="w-full p-3 border rounded-lg h-32" required></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Send Message
          </button>
          {status && <p className="text-center font-bold text-green-600 mt-4">{status}</p>}
        </form>
      </div>
    </section>
  );
}