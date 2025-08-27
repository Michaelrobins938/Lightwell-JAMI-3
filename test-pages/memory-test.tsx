import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MemoryDashboard from '../components/memory/MemoryDashboard';

export default function MemoryTestPage() {
  const [activeTab, setActiveTab] = useState<'test' | 'dashboard'>('test');
  const [userId, setUserId] = useState('test-user-123');
  const [message, setMessage] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testMemory = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setTestResults(null);

      const response = await fetch('/api/jamie/memory-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
      });

      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      console.error('Memory test failed:', error);
      setTestResults({ error: 'Test failed' });
    } finally {
      setLoading(false);
    }
  };

  const sampleMessages = [
    "I'm feeling really anxious about my work presentation tomorrow",
    "I had a great therapy session today and I'm feeling more confident",
    "My relationship with my partner has been really stressful lately",
    "I've been practicing the breathing exercises you taught me and they help",
    "I'm struggling with sleep again, I keep waking up at 3 AM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('test')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'test'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Memory Test
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Memory Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'test' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                🧠 Test Jamie's Memory System
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Send messages to Jamie and watch how she creates, stores, and uses memories 
                across conversations. This demonstrates the difference between just having 
                text descriptions and actually implementing a working memory system.
              </p>
            </div>

            {/* Test Interface */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Memory Test Interface
              </h2>

              {/* User ID Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID (for memory tracking)
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a user ID to track memories"
                />
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Jamie
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell Jamie something that should create memories..."
                />
              </div>

              {/* Sample Messages */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Test Messages
                </label>
                <div className="flex flex-wrap gap-2">
                  {sampleMessages.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(sample)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {sample.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Button */}
              <button
                onClick={testMemory}
                disabled={loading || !message.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '🧠 Testing Memory System...' : '🧠 Test Memory System'}
              </button>
            </div>

            {/* Test Results */}
            {testResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Test Results
                </h2>

                {testResults.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">❌ {testResults.error}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Jamie Response */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        🧠 Jamie's Response
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-blue-800">{testResults.jamieResponse.text}</p>
                        <div className="mt-2 text-sm text-blue-600">
                          <span className="mr-4">Safety: {testResults.jamieResponse.safetyStatus}</span>
                          <span>Audit ID: {testResults.jamieResponse.auditId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Therapeutic Response */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        💊 Therapeutic Response (Using Memories)
                      </h3>
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-green-800">{testResults.therapeuticResponse.text}</p>
                        <div className="mt-2 text-sm text-green-600">
                          <span className="mr-4">Crisis: {testResults.therapeuticResponse.crisisDetected ? 'Yes' : 'No'}</span>
                          <span>Techniques: {testResults.therapeuticResponse.therapeuticTechniques.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Memory Health */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        📊 Memory System Health
                      </h3>
                      <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Status:</span> {testResults.memoryHealth.status}
                          </div>
                          <div>
                            <span className="font-medium">Components:</span> {testResults.memoryHealth.components.length}
                          </div>
                          <div>
                            <span className="font-medium">Last Check:</span> {testResults.memoryHealth.lastCheck}
                          </div>
                          <div>
                            <span className="font-medium">Uptime:</span> {testResults.memoryHealth.uptime}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What This Demonstrates */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        🎯 What This Demonstrates
                      </h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <ul className="text-yellow-800 space-y-2 text-sm">
                          <li>✅ <strong>Memory Creation:</strong> Jamie extracts insights from your message and stores them</li>
                          <li>✅ <strong>Memory Storage:</strong> Memories are saved to the database with metadata</li>
                          <li>✅ <strong>Memory Retrieval:</strong> Jamie loads relevant memories for context</li>
                          <li>✅ <strong>Memory Usage:</strong> Responses are personalized based on stored memories</li>
                          <li>✅ <strong>Memory Analysis:</strong> Patterns and themes are identified across conversations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                🔧 How Jamie's Memory System Actually Works
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    ❌ What's NOT Memory (Just Text)
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 text-sm">
                      "You maintain context across multiple sessions" - This is just a description in a file. 
                      It doesn't actually DO anything.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    ✅ What IS Memory (Real Implementation)
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800 text-sm">
                      Database tables, memory creation functions, pattern analysis, and actual 
                      data storage/retrieval that makes responses personalized.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-700 mb-2">Memory System Components:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Memory Creation:</strong> Extracts insights from conversations</li>
                  <li>• <strong>Memory Storage:</strong> Saves to database with metadata</li>
                  <li>• <strong>Memory Analysis:</strong> Identifies patterns and themes</li>
                  <li>• <strong>Memory Retrieval:</strong> Loads relevant context</li>
                  <li>• <strong>Memory Usage:</strong> Personalizes responses</li>
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <MemoryDashboard />
        )}
      </div>
    </div>
  );
}
