import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Music, Book, Wind } from 'lucide-react';

interface Recommendation {
  id: number;
  text: string;
  icon: JSX.Element;
  category: string;
}

const allRecommendations: Recommendation[] = [
  { id: 1, text: "Take a warm bath with essential oils", icon: <Heart />, category: "relaxation" },
  { id: 2, text: "Practice deep breathing for 5 minutes", icon: <Wind />, category: "stress-relief" },
  { id: 3, text: "Listen to your favorite uplifting music", icon: <Music />, category: "mood-boost" },
  { id: 4, text: "Read a chapter of an inspiring book", icon: <Book />, category: "personal-growth" },
  { id: 5, text: "Make a cup of herbal tea", icon: <Coffee />, category: "relaxation" },
  // Add more recommendations...
];

const SelfCareRecommendations: React.FC = () => {
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const storedPreferences = localStorage.getItem('selfCarePreferences');
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  useEffect(() => {
    const filteredRecommendations = allRecommendations.filter(rec => 
      userPreferences.includes(rec.category)
    );
    const randomRecommendations = filteredRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendations(randomRecommendations);
  }, [userPreferences]);

  const togglePreference = (category: string) => {
    const updatedPreferences = userPreferences.includes(category)
      ? userPreferences.filter(pref => pref !== category)
      : [...userPreferences, category];
    setUserPreferences(updatedPreferences);
    localStorage.setItem('selfCarePreferences', JSON.stringify(updatedPreferences));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Self-Care Recommendations</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Preferences:</h3>
        <div className="flex flex-wrap gap-2">
          {['relaxation', 'stress-relief', 'mood-boost', 'personal-growth'].map(category => (
            <button
              key={category}
              onClick={() => togglePreference(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                userPreferences.includes(category)
                  ? 'bg-luna-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-luna-700 dark:text-luna-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {recommendations.map(rec => (
          <motion.div
            key={rec.id}
            className="flex items-center p-4 bg-luna-100 dark:bg-luna-700 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="mr-4 text-luna-500 dark:text-luna-300">{rec.icon}</div>
            <p>{rec.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SelfCareRecommendations;