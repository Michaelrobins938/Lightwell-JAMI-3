import React from 'react';

const lines = [
  'You are not alone.',
  'You are seen.',
  'You are safe here.',
  'Luna is your light in the darkness.'
];

export default function EmotionalCopyBlock() {
  return (
    <section className="relative py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Vignette + noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        <div className="w-full h-full opacity-20" style={{ backgroundImage: 'url(/images/noise.png)', backgroundSize: 'cover' }} />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-2xl md:text-3xl text-white font-serif italic tracking-wide animate-fade-in"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
} 