import React from 'react';

export default function ProblemSolutionSection() {
  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      {/* The Why */}
      <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 flex flex-col items-center animate-fade-in">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#b39ddb] to-[#5e35b1] shadow-lg">
          {/* Icon: Exclamation mark in circle */}
          <svg width="32" height="32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#b39ddb" opacity="0.2"/><text x="16" y="22" textAnchor="middle" fontSize="24" fill="#5e35b1">!</text></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">The Why</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
          Millions suffer in silence. Stigma, cost, and access barriers keep people from the help they need. The world is in a mental health crisis—and most solutions are out of reach.
        </p>
      </div>
      {/* The How */}
      <div className="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/40 dark:border-gray-800 shadow-xl p-8 flex flex-col items-center animate-fade-in delay-100">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#5e35b1] to-[#10141a] shadow-lg">
          {/* Icon: Heart in circle */}
          <svg width="32" height="32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#5e35b1" opacity="0.2"/><path d="M16 24s-6-4.35-6-8.5A3.5 3.5 0 0 1 16 12a3.5 3.5 0 0 1 6 3.5C22 19.65 16 24 16 24z" fill="#b39ddb"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">The How</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
          Luna listens, supports, and connects—instantly, privately, and with clinical-grade empathy. AI and human care, together. No stigma. No waiting. Just help, when you need it.
        </p>
      </div>
    </section>
  );
} 