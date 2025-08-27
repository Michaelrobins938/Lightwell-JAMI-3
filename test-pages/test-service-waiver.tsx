import React, { useState } from 'react';
import { ServiceWaiver } from '../components/legal/ServiceWaiver';

export default function TestServiceWaiverPage() {
  const [showWaiver, setShowWaiver] = useState(false);
  const [waiverData, setWaiverData] = useState<any>(null);

  const handleWaiverSigned = (data: any) => {
    console.log('Waiver signed:', data);
    setWaiverData(data);
    setShowWaiver(false);
    
    // Store in localStorage for testing
    localStorage.setItem('serviceWaiver', JSON.stringify(data));
    
    alert('Waiver signed successfully! Check console for data and localStorage for storage.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Service Waiver Test Page
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Instructions</h2>
          <div className="text-gray-300 space-y-2">
            <p>• Click "Show Service Waiver" to test the waiver modal</p>
            <p>• Complete all required fields and sign the waiver</p>
            <p>• Check the browser console for waiver data</p>
            <p>• Verify data is stored in localStorage</p>
            <p>• This simulates the flow from About page → Waiver → Signup</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => setShowWaiver(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Show Service Waiver
          </button>

          {waiverData && (
            <div className="bg-green-800 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">Waiver Data Received</h3>
              <pre className="text-sm text-green-200 overflow-auto">
                {JSON.stringify(waiverData, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-400">
            <p>After completing the waiver, you can test the full flow:</p>
            <p>1. Go to <a href="/about" className="text-blue-400 hover:underline">About page</a></p>
            <p>2. Click "Try AI Therapy Today"</p>
            <p>3. Complete the waiver</p>
            <p>4. Proceed to signup and onboarding</p>
          </div>
        </div>
      </div>

      {/* Service Waiver Modal */}
      {showWaiver && (
        <ServiceWaiver
          onWaiverSigned={handleWaiverSigned}
          onClose={() => setShowWaiver(false)}
        />
      )}
    </div>
  );
}
