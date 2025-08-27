import Image from 'next/image';

export default function TrustSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">Trusted by patients and professionals worldwide</h2>
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-sky-100 px-8 py-6 flex gap-8 items-center hover:scale-[1.02] transition-all duration-300">
        {/* Avatars */}
        <div className="flex -space-x-4">
          <Image src="/images/avatar1.png" alt="User 1" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white shadow" />
          <Image src="/images/avatar2.png" alt="User 2" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white shadow" />
          <Image src="/images/avatar3.png" alt="User 3" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white shadow" />
        </div>
        {/* Rating */}
        <div className="ml-6 flex items-center gap-2">
          <span className="text-2xl font-bold text-sky-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">4.9/5</span>
          <span className="text-gray-600">Avg. Rating</span>
        </div>
      </div>
    </section>
  );
} 