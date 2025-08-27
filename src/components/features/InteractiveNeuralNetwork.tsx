import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BrainRegion {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  size: number;
  color: string;
  connections: string[];
  isActive: boolean;
}

export default function InteractiveNeuralNetwork() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  const brainRegions: BrainRegion[] = [
    {
      id: 'emotional-core',
      name: 'Emotional Intelligence Core',
      description: 'Processes emotional patterns, empathy, and therapeutic responses',
      x: 50,
      y: 30,
      size: 80,
      color: 'bg-red-500',
      connections: ['crisis-detection', 'memory-system'],
      isActive: true
    },
    {
      id: 'crisis-detection',
      name: 'Crisis Detection Network',
      description: 'Monitors distress signals and triggers safety protocols',
      x: 80,
      y: 60,
      size: 70,
      color: 'bg-orange-500',
      connections: ['emotional-core', 'safety-protocols'],
      isActive: true
    },
    {
      id: 'memory-system',
      name: 'Memory Encoding System',
      description: 'Creates, stores, and retrieves therapeutic memories',
      x: 20,
      y: 70,
      size: 75,
      color: 'bg-blue-500',
      connections: ['emotional-core', 'pattern-recognition'],
      isActive: true
    },
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition Engine',
      description: 'Identifies recurring themes and emotional patterns',
      x: 70,
      y: 80,
      size: 65,
      color: 'bg-green-500',
      connections: ['memory-system', 'therapeutic-selector'],
      isActive: true
    },
    {
      id: 'therapeutic-selector',
      name: 'Therapeutic Technique Selector',
      description: 'Chooses appropriate interventions based on context',
      x: 30,
      y: 50,
      size: 70,
      color: 'bg-purple-500',
      connections: ['pattern-recognition', 'safety-protocols'],
      isActive: true
    },
    {
      id: 'safety-protocols',
      name: 'Safety Protocol Manager',
      description: 'Ensures ethical boundaries and crisis intervention',
      x: 60,
      y: 20,
      size: 60,
      color: 'bg-yellow-500',
      connections: ['crisis-detection', 'therapeutic-selector'],
      isActive: true
    }
  ];

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? null : regionId);
    const region = brainRegions.find(r => r.id === regionId);
    if (region) {
      setActiveConnections(region.connections);
    }
  };

  const getRegion = (id: string) => brainRegions.find(r => r.id === id);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🧠 Jamie's Neural Architecture
        </h3>
        <p className="text-gray-600">
          Click on brain regions to explore Jamie's cognitive components
        </p>
      </div>

      {/* Neural Network Visualization */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="relative w-full h-96">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {brainRegions.map(region => 
              region.connections.map(connectionId => {
                const targetRegion = getRegion(connectionId);
                if (!targetRegion) return null;
                
                const isActive = activeConnections.includes(connectionId) || 
                               activeConnections.includes(region.id);
                
                return (
                  <line
                    key={`${region.id}-${connectionId}`}
                    x1={`${region.x}%`}
                    y1={`${region.y}%`}
                    x2={`${targetRegion.x}%`}
                    y2={`${targetRegion.y}%`}
                    stroke={isActive ? '#3b82f6' : '#e5e7eb'}
                    strokeWidth={isActive ? '3' : '2'}
                    strokeDasharray={isActive ? 'none' : '5,5'}
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </svg>

          {/* Brain Regions */}
          {brainRegions.map(region => (
            <motion.div
              key={region.id}
              className={`absolute ${region.color} rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
                selectedRegion === region.id ? 'ring-4 ring-blue-400 scale-110' : ''
              }`}
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.size}px`,
                height: `${region.size}px`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleRegionClick(region.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-xs font-bold text-center leading-tight">
                  {region.name.split(' ').map(word => word[0]).join('')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Region Information */}
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-lg p-4 shadow-lg border border-blue-200"
          >
            {(() => {
              const region = getRegion(selectedRegion);
              if (!region) return null;
              
              return (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {region.name}
                  </h4>
                  <p className="text-gray-600 mb-3">{region.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Connections:</span>
                    {region.connections.map(connId => {
                      const connRegion = getRegion(connId);
                      return (
                        <span
                          key={connId}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {connRegion?.name.split(' ')[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Network Status */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Neural Network Active
          </div>
        </div>
      </div>
    </div>
  );
}
