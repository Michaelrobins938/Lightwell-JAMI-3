"use client";

import Link from "next/link";

export default function HomepageCommunitySection() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-16 text-center">
      <h2 className="text-5xl font-extrabold text-white mb-6">
        Find Your Light Together
      </h2>

      <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
        A compassionate community where you can share your journey, find support,
        and be the light in the dark for others. Everyone's story matters — healing happens together.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        <div className="card-glass-dark p-6">
          <p className="text-3xl font-bold text-yellow-400">2.4k+</p>
          <p className="text-gray-300 text-sm font-medium">Members</p>
        </div>
        <div className="card-glass-dark p-6">
          <p className="text-3xl font-bold text-green-400">15k+</p>
          <p className="text-gray-300 text-sm font-medium">Posts Shared</p>
        </div>
        <div className="card-glass-dark p-6">
          <p className="text-3xl font-bold text-pink-400">50k+</p>
          <p className="text-gray-300 text-sm font-medium">Hearts Given</p>
        </div>
        <div className="card-glass-dark p-6">
          <p className="text-3xl font-bold text-blue-400">24/7</p>
          <p className="text-gray-300 text-sm font-medium">Support</p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/community"
        className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition-all duration-200"
      >
        Explore the Community
      </Link>
    </section>
  );
}
