// Demo page for thread branching functionality

import React from 'react';
import Head from 'next/head';
// import { ThreadBranchingChatInterface } from '../components/chat/ThreadBranchingChatInterface'; // Component not implemented yet

export default function DemoThreadsPage() {
  return (
    <>
      <Head>
        <title>Thread Branching Demo - Luna AI</title>
        <meta name="description" content="Demonstration of conversation thread branching and navigation" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Thread Branching Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore conversation threads by editing messages and creating branches. 
              Navigate through different conversation paths and visualize your thread tree.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Thread Branches
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create branches by editing messages or regenerating responses to explore different conversation paths.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Visual Navigation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Navigate through conversation history and visualize thread branches with an interactive tree view.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Message Editing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Edit any message to automatically create a new branch and generate alternative responses.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Auto-Save
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Thread branches are automatically saved locally, so you can continue exploring later.
              </p>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden" style={{ height: '700px' }}>
            <ThreadBranchingChatInterface
              userId="demo-threads-user"
              onNewMessage={(message) => {
                console.log('New message in thread:', message);
              }}
              className="h-full"
            />
          </div>

          {/* Instructions */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* How to Create Branches */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                How to Create Branches
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li>Start a conversation with the AI</li>
                <li>Hover over any of your messages and click the edit button</li>
                <li>Modify your message and click "Resubmit"</li>
                <li>A new branch will be created automatically</li>
                <li>You can also use the regenerate button for AI responses</li>
              </ol>
            </div>

            {/* How to Navigate */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                How to Navigate Branches
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-green-800 dark:text-green-200 text-sm">
                <li>Click the "Branches" button to open the visualizer</li>
                <li>See your conversation tree with all branches</li>
                <li>Click on any node to switch to that branch</li>
                <li>Use "Return to Present" when viewing history</li>
                <li>Delete unwanted branches with the delete button</li>
              </ol>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Why Use Thread Branching?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Explore Ideas:</strong> Try different phrasings and see how the AI responds differently
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>No Dead Ends:</strong> Never lose interesting conversation paths or good responses
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Efficient Testing:</strong> Quickly compare different approaches without starting over
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}