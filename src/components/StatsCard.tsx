import React from 'react';

export default function StatsCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center border border-sky-100 dark:border-gray-800 transition-transform hover:-translate-y-2 hover:shadow-2xl hover:bg-white/90 dark:hover:bg-gray-900/90 duration-300">
      <div className="mb-2">{icon}</div>
      <span className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">{value}</span>
      <span className="text-sky-600 dark:text-sky-300 text-lg font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">{label}</span>
    </div>
  );
} 