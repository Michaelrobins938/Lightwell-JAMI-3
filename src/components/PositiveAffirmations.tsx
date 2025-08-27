import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Affirmation {
  id: number;
  text: string;
  category: string;
}

const PositiveAffirmations: React.FC = () => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [likedAffirmations, setLikedAffirmations] = useState<number[]>([]);
  const [dislikedAffirmations, setDislikedAffirmations] = useState<number[]>([]);

  const generateRandomAffirmation = useCallback((affirmationsData: Affirmation[] = affirmations) => {
    const filteredAffirmations = affirmationsData.filter(
      affirmation => !dislikedAffirmations.includes(affirmation.id)
    );
    if (filteredAffirmations.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredAffirmations.length);
      setCurrentAffirmation(filteredAffirmations[randomIndex]);
    } else {
      setCurrentAffirmation(null);
    }
  }, [affirmations, dislikedAffirmations]);

  useEffect(() => {
    const fetchAffirmations = async () => {
      const response = await fetch('/api/affirmations');
      const data = await response.json();
      setAffirmations(data);
      generateRandomAffirmation(data);
    };
    fetchAffirmations();

    const storedLiked = localStorage.getItem('likedAffirmations');
    if (storedLiked) setLikedAffirmations(JSON.parse(storedLiked));

    const storedDisliked = localStorage.getItem('dislikedAffirmations');
    if (storedDisliked) setDislikedAffirmations(JSON.parse(storedDisliked));
  }, [generateRandomAffirmation]);

  useEffect(() => {
    localStorage.setItem('likedAffirmations', JSON.stringify(likedAffirmations));
  }, [likedAffirmations]);

  useEffect(() => {
    localStorage.setItem('dislikedAffirmations', JSON.stringify(dislikedAffirmations));
  }, [dislikedAffirmations]);

  const handleLike = () => {
    if (currentAffirmation && !likedAffirmations.includes(currentAffirmation.id)) {
      setLikedAffirmations([...likedAffirmations, currentAffirmation.id]);
    }
    generateRandomAffirmation();
  };

  const handleDislike = () => {
    if (currentAffirmation) {
      setDislikedAffirmations([...dislikedAffirmations, currentAffirmation.id]);
      generateRandomAffirmation();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Positive Affirmations</h2>
      {currentAffirmation ? (
        <div>
          <motion.p
            key={currentAffirmation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl mb-6 p-4 bg-luna-100 dark:bg-luna-700 rounded-lg text-center"
          >
            {currentAffirmation.text}
          </motion.p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleLike}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <ThumbsUp size={24} />
            </button>
            <button
              onClick={() => generateRandomAffirmation()}
              className="p-2 bg-luna-500 text-white rounded-full hover:bg-luna-600 transition-colors"
            >
              <RefreshCw size={24} />
            </button>
            <button
              onClick={handleDislike}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <ThumbsDown size={24} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No more affirmations available. Try resetting your preferences.</p>
      )}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Favorite Affirmations</h3>
        <ul className="space-y-2">
          {affirmations
            .filter(affirmation => likedAffirmations.includes(affirmation.id))
            .map(affirmation => (
              <li key={affirmation.id} className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                {affirmation.text}
              </li>
            ))
          }
        </ul>
      </div>
    </motion.div>
  );
};

export default PositiveAffirmations;