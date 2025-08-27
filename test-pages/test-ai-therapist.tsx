import React from 'react';
import type { ReactElement } from 'react';
import { ChatLayout } from '../components/layout/ChatLayout';
import type { NextPageWithLayout } from './_app';

interface TestAITherapistProps {
  className?: string;
}

const TestAITherapist: NextPageWithLayout<TestAITherapistProps> = ({ className = '' }) => {
  // Simple test to see if the page itself is working
  const [showRealInterface, setShowRealInterface] = React.useState(false);

  if (!showRealInterface) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">AI Therapist Test Page</h1>
          <p className="text-gray-600 mb-4">Page is loading correctly!</p>
          <div className="space-x-4">
            <button
              onClick={() => setShowRealInterface(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load Real Interface
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Import the actual working enhanced chat interface
  const EnhancedChatInterface = React.lazy(() => import('./Chat').then(mod => ({ default: mod.UnifiedChatInterface })));

  return (
    <React.Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Therapist...</p>
        </div>
      </div>
    }>
      <EnhancedChatInterface />
    </React.Suspense>
  );
};

// Use a custom layout that bypasses the default layout
TestAITherapist.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default TestAITherapist;
