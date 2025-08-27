// Demo page for message editing functionality

import React from 'react';
import Head from 'next/head';
// import { EditableChatInterface } from '../components/chat/EditableChatInterface'; // Component not implemented yet

export default function DemoEditingPage() {
  return (
    <>
      <Head>
        <title>Message Editing Demo - Luna AI</title>
        <meta name="description" content="Demonstration of message editing and resubmit functionality" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Message Editing Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience ChatGPT-style message editing. Edit your messages and watch 
              the AI generate new responses based on your changes.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Edit Messages
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click the pencil icon on any user message to edit and resubmit for a new AI response.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Multimodal Input
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Drag and drop images or use the image button to add visual context to your conversations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Real-time Streaming
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Watch AI responses stream in real-time with typing indicators and smooth transitions.
              </p>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
            <EditableChatInterface
              userId="demo-user"
              onNewMessage={(message) => {
                console.log('New message:', message);
              }}
              className="h-full"
            />
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              How to Use Message Editing
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
              <li>Send a message to start the conversation</li>
              <li>Hover over any of your messages to see the edit button (pencil icon)</li>
              <li>Click the edit button to modify your message</li>
              <li>Click "Resubmit" to send the edited message and get a new AI response</li>
              <li>The conversation history is updated, removing any responses after the edited message</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}