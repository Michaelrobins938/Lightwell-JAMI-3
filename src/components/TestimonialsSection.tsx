"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Alex R.',
    quote: 'Luna was there for me when no one else was. I felt truly heard.',
    avatar: '/images/avatar1.png',
    signature: 'Alex R.'
  },
  {
    name: 'Dr. Maya Chen',
    quote: 'As a clinician, I trust Luna to support my patients between sessions.',
    avatar: '/images/avatar2.png',
    signature: 'Dr. Maya Chen'
  },
  {
    name: 'Samira P.',
    quote: 'The AI is so empathetic—it feels like talking to a real person.',
    avatar: '/images/avatar3.png',
    signature: 'Samira P.'
  },
  {
    name: 'Jordan K.',
    quote: 'I found hope again. Luna is a lifeline.',
    avatar: '/images/avatar4.png',
    signature: 'Jordan K.'
  },
  {
    name: 'Priya S.',
    quote: 'The Quiet Space feature helped me through my darkest days.',
    avatar: '/images/avatar5.png',
    signature: 'Priya S.'
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col items-center">
      {/* Featured quote */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-2xl border border-white/40 dark:border-gray-800 shadow-xl p-10 mb-12 max-w-2xl w-full text-center animate-fade-in">
        <p className="text-2xl md:text-3xl text-gray-900 dark:text-white italic mb-6">“{testimonials[0].quote}”</p>
        <div className="flex flex-col items-center gap-2">
          <Image src={testimonials[0].avatar} alt={testimonials[0].name} width={56} height={56} className="w-14 h-14 rounded-full border-2 border-white shadow" />
          <span className="font-serif text-lg text-gray-700 dark:text-gray-200">{testimonials[0].signature}</span>
        </div>
      </div>
      {/* Card slider */}
      <div className="w-full flex flex-row gap-6 justify-center items-stretch">
        {testimonials.slice(1, 5).map((t, i) => (
          <div
            key={t.name}
            className={`bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-800 shadow-lg p-6 flex flex-col items-center w-64 transition-all duration-500 ${current === i ? 'scale-105 shadow-2xl' : 'opacity-70'}`}
            aria-live="polite"
          >
            <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white shadow mb-4" />
            <p className="text-lg text-gray-900 dark:text-white italic mb-4">“{t.quote}”</p>
            <span className="font-serif text-base text-gray-700 dark:text-gray-200">{t.signature}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 