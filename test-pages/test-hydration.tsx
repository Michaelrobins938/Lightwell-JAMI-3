import React from 'react';
import ClientOnly from '../components/ClientOnly';

const TestHydration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🧪 Hydration Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Testing Client-Only Rendering</h2>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current Time (Client Only):</h3>
              <p className="text-lg">
                <ClientOnly>{new Date().toLocaleTimeString()}</ClientOnly>
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current Date (Client Only):</h3>
              <p className="text-lg">
                <ClientOnly>
                  {new Date().toLocaleDateString()}
                </ClientOnly>
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Full DateTime (Client Only):</h3>
              <p className="text-lg">
                <ClientOnly>
                  {new Date().toLocaleString()}
                </ClientOnly>
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Server-Side Content (No Hydration Error):</h3>
              <p className="text-lg">This content is rendered on the server and should not cause hydration errors.</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Hydration Test Results</h3>
            <p className="text-green-700 dark:text-green-300">
              If you can see this page without any hydration errors in the console, 
              the ClientOnly component is working correctly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHydration; 