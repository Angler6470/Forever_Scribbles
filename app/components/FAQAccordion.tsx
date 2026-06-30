'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What file formats do you accept?',
    answer:
      'Upload any clear photo or scan of your child’s drawing. We recommend JPG, PNG, or PDF for best results.',
  },
  {
    question: 'How long does it take?',
    answer:
      'Most conversions finish instantly, so you can download your new coloring page in seconds.',
  },
  {
    question: 'Can I keep the original style?',
    answer:
      'Yes. We preserve the personality of your child’s strokes while simplifying them into clean outlines.',
  },
  {
    question: 'Can I print it at home?',
    answer:
      'Absolutely. The output is optimized for home printing and works great on standard letter-size paper.',
  },
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Need help?</p>
          <h2 className="text-4xl font-bold mt-4">Frequently Asked Questions</h2>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={faq.question} className="rounded-3xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xl font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-2xl font-bold text-blue-600">{isOpen ? '−' : '+'}</span>
                </button>
                <div className={`${isOpen ? 'max-h-72 py-4 px-8' : 'max-h-0 px-8'} overflow-hidden transition-all duration-300 ease-out`}>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
