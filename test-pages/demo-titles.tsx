// Demo page for AI-generated chat titles

import React from 'react';
import Head from 'next/head';
// import { TitledChatInterface } from '../components/chat/TitledChatInterface'; // Component not implemented yet

export default function DemoTitlesPage() {
  return (
    <>
      <Head>
        <title>AI Chat Titles Demo - Luna AI</title>
        <meta name="description" content="Demonstration of AI-generated chat titles with background LLM processing" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              AI-Generated Chat Titles
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience intelligent conversation titles powered by AI. Luna automatically generates 
              meaningful titles for your chats, with options for manual editing and alternative suggestions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Auto Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Titles are automatically generated after 4 messages using advanced AI analysis.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Manual Editing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click any title to edit it manually or use the regenerate button for alternatives.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Smart Suggestions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get multiple AI-generated title suggestions with confidence scores and reasoning.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Background Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Titles are generated in the background with caching for optimal performance.
              </p>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden" style={{ height: '700px' }}>
            <TitledChatInterface
              userId="demo-titles-user"
              chatId="demo-titles-chat"
              onNewMessage={(message) => {
                console.log('New message with title generation:', message);
              }}
              onTitleChange={(title) => {
                console.log('Title changed to:', title);
              }}
              className="h-full"
            />
          </div>

          {/* How It Works */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* AI Generation Process */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Generation Process
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>Conversation reaches 4+ messages</li>
                <li>AI analyzes recent message context</li>
                <li>Generates meaningful title using GPT-3.5-turbo</li>
                <li>Applies style preferences (descriptive, concise, creative)</li>
                <li>Caches result for performance</li>
                <li>Updates UI with generated title</li>
              </ol>
            </div>

            {/* Title Styles */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Available Styles
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Descriptive:</strong> Clear explanation of conversation topic
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Concise:</strong> Brief, minimal word titles
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Creative:</strong> Engaging, essence-capturing titles
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Technical:</strong> Focus on specific topics/problems
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo Instructions */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Try the Interactive Demo
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">To See Auto-Generation:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li>Send at least 4 messages back and forth with the AI</li>
                  <li>Watch the title appear automatically at the top</li>
                  <li>Notice the "AI generated" indicator</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">To Try Manual Features:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li>Click on any generated title to edit it</li>
                  <li>Use the regenerate button for alternatives</li>
                  <li>Click the options menu for more features</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Example Titles */}
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Example Generated Titles
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  "Python List Comprehension Help"
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  From: "How do I filter a list in Python?"
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  "React Component Architecture Discussion"
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  From: "What's the best way to structure React components?"
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  "Career Change Advice Session"
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  From: "I'm thinking about switching careers..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}