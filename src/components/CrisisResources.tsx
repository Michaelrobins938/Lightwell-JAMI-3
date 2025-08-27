"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Globe, MapPin } from 'lucide-react';

interface Resource {
  id: number;
  name: string;
  description: string;
  phone?: string;
  website?: string;
  address?: string;
}

const CrisisResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/crisis-resources');
        if (!response.ok) {
          throw new Error('Failed to fetch crisis resources');
        }
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setResources([]);
        }
      } catch (err) {
        console.error('Error fetching crisis resources:', err);
        setError('Failed to load crisis resources');
        setResources([]);
      }
    };
    fetchResources();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Safety check to ensure resources is an array before sorting
  const sortedResources = Array.isArray(resources) ? resources.sort((a, b) => {
    if (userLocation && a.address && b.address) {
      const [latA, lonA] = a.address.split(',').map(Number);
      const [latB, lonB] = b.address.split(',').map(Number);
      const distA = calculateDistance(userLocation.lat, userLocation.lon, latA, lonA);
      const distB = calculateDistance(userLocation.lat, userLocation.lon, latB, lonB);
      return distA - distB;
    }
    return 0;
  }) : [];

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Crisis Resources</h2>
        <p className="text-red-600 font-semibold">If you're experiencing a life-threatening emergency, please call 911 immediately.</p>
        <p className="text-red-500 mt-4">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Crisis Resources</h2>
      <p className="mb-6 text-red-600 font-semibold">If you're experiencing a life-threatening emergency, please call 911 immediately.</p>
      {sortedResources.length === 0 ? (
        <p className="text-gray-500">Loading crisis resources...</p>
      ) : (
        sortedResources.map((resource) => (
          <motion.div
            key={resource.id}
            className="mb-6 p-4 border rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-xl font-semibold mb-2">{resource.name}</h3>
            <p className="mb-2">{resource.description}</p>
            {resource.phone && (
              <p className="flex items-center mb-1">
                <Phone size={18} className="mr-2 text-luna-500" />
                <a href={`tel:${resource.phone}`} className="text-luna-500 hover:underline">{resource.phone}</a>
              </p>
            )}
            {resource.website && (
              <p className="flex items-center mb-1">
                <Globe size={18} className="mr-2 text-luna-500" />
                <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-luna-500 hover:underline">Visit Website</a>
              </p>
            )}
            {resource.address && (
              <p className="flex items-center">
                <MapPin size={18} className="mr-2 text-luna-500" />
                <span>{resource.address}</span>
              </p>
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default CrisisResources;