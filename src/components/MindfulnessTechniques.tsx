import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface Technique {
  id: number;
  name: string;
  description: string;
  duration: number; // in seconds
  steps: string[];
}

const MindfulnessTechniques: React.FC = () => {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [currentTechnique, setCurrentTechnique] = useState<Technique | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const fetchTechniques = async () => {
      const response = await fetch('/api/mindfulness-techniques');
      const data = await response.json();
      setTechniques(data);
    };
    fetchTechniques();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTechnique) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time > 0) return time - 1;
          if (currentStep < currentTechnique.steps.length - 1) {
            setCurrentStep(currentStep + 1);
            return Math.floor(currentTechnique.duration / currentTechnique.steps.length);
          }
          setIsPlaying(false);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTechnique, currentStep]);

  const startTechnique = (technique: Technique) => {
    setCurrentTechnique(technique);
    setCurrentStep(0);
    setTimeRemaining(Math.floor(technique.duration / technique.steps.length));
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const resetTechnique = () => {
    if (currentTechnique) {
      setCurrentStep(0);
      setTimeRemaining(Math.floor(currentTechnique.duration / currentTechnique.steps.length));
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Mindfulness & Grounding Techniques</h2>
      {!currentTechnique ? (
        <div className="space-y-4">
          {techniques.map((technique) => (
            <motion.div
              key={technique.id}
              className="p-4 border rounded-lg cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => startTechnique(technique)}
            >
              <h3 className="text-xl font-semibold mb-2">{technique.name}</h3>
              <p className="mb-2">{technique.description}</p>
              <p className="text-sm text-gray-500">Duration: {formatTime(technique.duration)}</p>
              <ChevronRight size={18} className="mt-2 text-luna-500" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">{currentTechnique.name}</h3>
          <div className="mb-4 p-4 bg-luna-100 dark:bg-luna-700 rounded-lg">
            <p>{currentTechnique.steps[currentStep]}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
            <div className="space-x-4">
              <button
                onClick={togglePlay}
                className="p-2 bg-luna-500 text-white rounded-full hover:bg-luna-600 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={resetTechnique}
                className="p-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-luna-500 h-2.5 rounded-full"
              style={{ width: `${(currentStep + 1) * (100 / currentTechnique.steps.length)}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MindfulnessTechniques;