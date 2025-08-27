import React from 'react';
import Head from 'next/head';

export default function TestForm() {
  return (
    <>
      <Head>
        <title>Form Test - Luna</title>
      </Head>
      
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Form Input Test</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Test Input 1
              </label>
              <input
                type="text"
                placeholder="Can you see this input?"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Test Input 2
              </label>
              <input
                type="email"
                placeholder="Email input test"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Test Textarea
              </label>
              <textarea
                placeholder="Textarea test"
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 resize-none"
              />
            </div>
            
            <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Test Button
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-2">Debug Info:</h2>
            <p className="text-zinc-400 text-sm">
              If you can see this text and the form inputs above, the issue is not with basic CSS.
              If you can't see the inputs, there's a CSS conflict or the inputs are being hidden.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
