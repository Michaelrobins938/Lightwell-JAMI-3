import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function SecurityDashboard() {
  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 mr-2" />
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            <h3 className="font-semibold">System Status</h3>
          </div>
          <p className="text-green-400">Secure</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <XCircle className="w-5 h-5 mr-2 text-red-400" />
            <h3 className="font-semibold">Threats Detected</h3>
          </div>
          <p className="text-red-400">0</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            <h3 className="font-semibold">Warnings</h3>
          </div>
          <p className="text-yellow-400">0</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            <h3 className="font-semibold">Protection Level</h3>
          </div>
          <p className="text-blue-400">High</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Security Monitoring</h2>
        <p className="text-gray-400">
          All systems are operating normally. No security threats detected.
        </p>
      </div>
    </div>
  );
}