import { useRouter } from 'next/router';
import Link from 'next/link';
import { therapyTools } from '../../data/therapyTools';
import { ArrowLeft, Clock, Shield, Heart, Star } from 'lucide-react';

export default function TherapyDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const tool = therapyTools.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tool not found</h1>
          <Link href="/support" className="text-emerald-400 hover:text-emerald-300">
            ← Back to Support Tools
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      reflection: Heart,
      cognition: '🧠',
      mindfulness: '🌱',
      support: '🤝',
      growth: '🌟'
    };
    return icons[category as keyof typeof icons] || '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/support" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Support Tools
        </Link>

        {/* Hero Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icon and Basic Info */}
            <div className="flex-shrink-0">
              <div className="text-6xl mb-4">{tool.icon}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm border ${getDifficultyBadge(tool.difficulty)}`}>
                  {tool.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-slate-700/50 text-gray-300 border border-slate-600/30">
                  {tool.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {tool.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {tool.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{tool.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Private</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Guided</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">AI Support</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={tool.toolLink}
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Begin {tool.title}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About This Practice</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {tool.longDescription}
          </p>
        </div>

        {/* How It Helps */}
        {tool.examples && tool.examples.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">How This Can Help</h2>
            <div className="grid gap-4">
              {tool.examples.map((example, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety & Privacy */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Safety & Privacy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Your Privacy is Protected</h3>
              <p className="text-gray-300 text-sm">
                All your interactions with this tool are completely private and secure.
                Your personal reflections and progress are never shared without your explicit consent.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Professional Support Available</h3>
              <p className="text-gray-300 text-sm">
                If you ever need additional support, Jamie AI can help you find professional
                mental health resources in your area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

