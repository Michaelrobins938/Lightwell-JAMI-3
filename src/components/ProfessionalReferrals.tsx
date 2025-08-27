"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Globe, Star } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  specialties: string[];
  address: string;
  phone: string;
  website: string;
  rating: number;
}

const ProfessionalReferrals: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfessionals();
    getUserLocation();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('/api/mental-health-professionals');
      if (!response.ok) {
        throw new Error('Failed to fetch mental health professionals');
      }
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProfessionals(data);
      } else {
        console.error('Expected array but got:', typeof data, data);
        setProfessionals([]);
      }
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
      setError('Failed to load mental health professionals');
      setProfessionals([]);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Safety check to ensure professionals is an array before filtering
  const filteredProfessionals = Array.isArray(professionals) ? professionals.filter(
    pro => selectedSpecialties.length === 0 || pro.specialties.some(s => selectedSpecialties.includes(s))
  ) : [];

  const sortedProfessionals = userLocation
    ? filteredProfessionals.sort((a, b) => {
        const distA = calculateDistance(userLocation, a.address);
        const distB = calculateDistance(userLocation, b.address);
        return distA - distB;
      })
    : filteredProfessionals;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Mental Health Professional Referrals</h2>
        <p className="text-red-500 mt-4">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Mental Health Professional Referrals</h2>
      {Array.isArray(professionals) && professionals.length > 0 ? (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Filter by Specialty:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(professionals.flatMap(p => p.specialties))).map(specialty => (
                <button
                  key={specialty}
                  onClick={() => toggleSpecialty(specialty)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSpecialties.includes(specialty)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {sortedProfessionals.map(pro => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border rounded-lg p-4"
              >
                <h3 className="text-xl font-semibold">{pro.name}</h3>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={index < pro.rating ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2">{pro.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pro.specialties.join(', ')}</p>
                <div className="flex items-center mb-1">
                  <MapPin size={16} className="mr-2" />
                  <span>{pro.address}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Phone size={16} className="mr-2" />
                  <a href={`tel:${pro.phone}`} className="text-blue-500 hover:underline">{pro.phone}</a>
                </div>
                <div className="flex items-center">
                  <Globe size={16} className="mr-2" />
                  <a href={pro.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{pro.website}</a>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading mental health professionals...</p>
      )}
    </motion.div>
  );
};

const calculateDistance = (userLocation: { lat: number; lon: number }, address: string): number => {
  // Implement distance calculation logic here
  // This is a placeholder function
  return 0;
};

export default ProfessionalReferrals;