"use client";

import Link from "next/link";

export default function HomepageFooter() {
  const links = ["Research", "Safety", "For Business", "For Developers", "Community", "News", "Company"];

  return (
    <footer className="w-full border-t border-gray-700 bg-gray-900 p-8 mt-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 text-sm max-w-6xl mx-auto">
        {links.map((l) => (
          <Link 
            key={l} 
            href={`/${l.toLowerCase().replace(/\s+/g, "-")}`} 
            className="hover:text-white transition text-gray-400 font-medium"
          >
            {l}
          </Link>
        ))}
      </div>
      <div className="text-center mt-8 pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Lightwell. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
