"use client";

import Link from "next/link";

export default function HomepageSidebar() {
  const features = [
    "Research",
    "Safety", 
    "For Business", 
    "For Developers", 
    "Community", 
    "News", 
    "Company"
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-700 p-6 fixed left-0 top-0 h-full">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Lightwell
      </h1>
      <nav className="flex flex-col space-y-4">
        {features.map((f) => (
          <Link 
            key={f} 
            href={`/${f.toLowerCase().replace(/\s+/g, "-")}`} 
            className="hover:text-white transition-all duration-200 text-gray-300 hover:scale-105 hover:bg-gray-800 px-3 py-2 rounded-lg"
          >
            {f}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
