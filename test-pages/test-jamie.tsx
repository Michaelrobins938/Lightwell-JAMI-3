import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Beaker, Brain, MessageCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  testType: string;
  model?: string;
  tokens?: number;
  debug?: any;
  error?: string;
}

export default function TestJamie() {
  const [testMessage, setTestMessage] = useState('Hello, I\'m feeling a bit anxious today.');
  const [testType, setTestType] = useState('therapeutic');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  const runTest = async (type: string, message: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType: type, message }),
      });

      const result = await response.json();
      setResults(prev => [...prev, { ...result, testType: type }]);
    } catch (error) {
      setResults(prev => [...prev, { 
        success: false, 
        message: 'Test failed', 
        testType: type,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput('');

    try {
      const response = await fetch('/api/chat-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages,
          userId: 'test-user',
          useEnhanced: true
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I\'m having trouble responding right now.' 
        }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error connecting to my services.' 
      }]);
    }
  };

  const runAllTests = async () => {
    setResults([]);
    await runTest('basic', 'Hello, how are you?');
    await runTest('therapeutic', 'I\'m feeling overwhelmed with work lately.');
    await runTest('crisis', 'I am feeling very hopeless and don\'t see a way out.');
    await runTest('conversation', 'I had a really stressful day at work.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">🧪 Jamie AI Testing Console</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test and debug the LLM connection for Jamie AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Beaker className="w-6 h-6 text-blue-500" />
              LLM Connection Tests
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Test Type:</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="basic">Basic Connection</option>
                  <option value="therapeutic">Therapeutic Response</option>
                  <option value="crisis">Crisis Assessment</option>
                  <option value="conversation">Conversation Flow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Test Message:</label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => runTest(testType, testMessage)}
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : 'Run Test'}
                </button>
                <button
                  onClick={runAllTests}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Run All Tests
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-semibold">{result.testType} Test</span>
                  </div>
                  <p className="text-sm mb-2">{result.message}</p>
                  {result.error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
                  )}
                  {result.debug && (
                    <details className="text-xs">
                      <summary className="cursor-pointer">Debug Info</summary>
                      <pre className="mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {JSON.stringify(result.debug, null, 2)}
                      </pre>
                    </details>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-500" />
              Live Chat Test
            </h2>

            <div className="h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {chatMessages.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Start a conversation with Jamie...
                  </p>
                )}
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 