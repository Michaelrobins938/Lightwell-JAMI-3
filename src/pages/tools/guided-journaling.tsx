import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, RotateCcw, Heart, MessageCircle } from 'lucide-react';

export default function GuidedJournalingTool() {
  const [entry, setEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const journalPrompts = [
    "What emotions am I feeling right now, and where do I feel them in my body?",
    "What small act of kindness can I do for myself today?",
    "What am I grateful for in this moment?",
    "What challenge am I facing, and what might be a gentle way to approach it?",
    "How can I show myself the same compassion I'd offer a dear friend?",
    "What does my inner voice sound like today - encouraging or critical?",
    "What would I say to myself if I were feeling overwhelmed?",
    "What brings me a sense of peace or calm?",
    "How have I grown or learned something new recently?",
    "What does self-care look like for me today?"
  ];

  const handleSave = async () => {
    if (!entry.trim()) return;

    setIsSaving(true);
    try {
      // Simulate saving to a backend or local storage
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you'd save to your backend here
      console.log('Journal entry saved:', {
        prompt: journalPrompts[selectedPrompt],
        entry,
        timestamp: new Date().toISOString()
      });

      // Show success feedback
      setEntry('');
      setSelectedPrompt(0);

      // You could also show a toast notification here
      alert('Your journal entry has been saved. Great work reflecting today!');

    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('There was an error saving your entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    setSelectedPrompt(randomIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/support/guided-journaling" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Guided Journaling
        </Link>

        {/* Welcome Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{therapyTools.find(t => t.slug === 'guided-journaling')?.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-white">Guided Journaling</h1>
              <p className="text-gray-300">A safe space to write and reflect with gentle guidance</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Completely Private</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm">AI Guidance Available</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Save className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Auto-Saved Entries</span>
            </div>
          </div>
        </div>

        {/* Journaling Interface */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Today's Journaling Prompt</h2>

            <div className="bg-slate-800/50 rounded-xl p-6 mb-4">
              <p className="text-gray-300 text-lg italic mb-4">
                "{journalPrompts[selectedPrompt]}"
              </p>

              <div className="flex gap-3">
                <button
                  onClick={getRandomPrompt}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-lg transition-colors text-emerald-400"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Prompt
                </button>

                <div className="text-sm text-gray-500">
                  Prompt {selectedPrompt + 1} of {journalPrompts.length}
                </div>
              </div>
            </div>
          </div>

          {/* Writing Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Reflection
            </label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Take your time to write what's in your heart... Jamie AI is here to listen without judgment."
              className="w-full h-64 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
            />

            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{entry.length} characters</span>
              <span>Take your time - this is your safe space</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={!entry.trim() || isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your writing?')) {
                  setEntry('');
                }
              }}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Gentle Encouragement */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-400">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Remember, there's no right or wrong way to journal. Just be honest with yourself.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import the therapy tools data (this would be imported from the actual file)
const therapyTools = [
  { slug: 'guided-journaling', icon: '📔' }
];

