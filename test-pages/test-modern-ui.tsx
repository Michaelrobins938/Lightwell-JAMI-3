import React from 'react';
import type { ReactElement } from 'react';
import ModernChatInterface from '../components/modern/ModernChatInterface';
import type { NextPageWithLayout } from './_app';

const TestModernUI: NextPageWithLayout = () => {
  return (
    <div>
      <div className="fixed top-4 left-4 z-50 bg-green-600 text-white px-3 py-1 rounded text-sm">
        ✅ Modern UI Loaded Successfully
      </div>
      <ModernChatInterface />
    </div>
  );
};

// Use a custom layout that bypasses the default layout
TestModernUI.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default TestModernUI;