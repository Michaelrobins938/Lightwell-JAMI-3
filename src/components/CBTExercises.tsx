import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface CBTExercise {
  id: number;
  title: string;
  description: string;
  steps: string[];
}

const CBTExercises: React.FC = () => {
  const [exercises, setExercises] = useState<CBTExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<CBTExercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const response = await fetch('/api/cbt-exercises');
      const data = await response.json();
      setExercises(data);
    };
    fetchExercises();
  }, []);

  const startExercise = (exercise: CBTExercise) => {
    setCurrentExercise(exercise);
    setCurrentStep(0);
    setUserResponses([]);
  };

  const handleNextStep = (response: string) => {
    setUserResponses([...userResponses, response]);
    if (currentExercise && currentStep < currentExercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Exercise completed
      // Here you could save the responses or provide a summary
      setCurrentExercise(null);
      setCurrentStep(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">CBT Exercises</h2>
      {!currentExercise ? (
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              className="p-4 border rounded-lg cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => startExercise(exercise)}
            >
              <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
              <p>{exercise.description}</p>
              <ArrowRight size={18} className="mt-2 text-luna-500" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">{currentExercise.title}</h3>
          <p className="mb-4">{currentExercise.steps[currentStep]}</p>
          <textarea
            className="w-full p-2 mb-4 border rounded-lg resize-none dark:bg-luna-700 dark:text-luna-100"
            rows={4}
            placeholder="Your response..."
            value={userResponses[currentStep] || ''}
            onChange={(e) => {
              const newResponses = [...userResponses];
              newResponses[currentStep] = e.target.value;
              setUserResponses(newResponses);
            }}
          />
          <button
            onClick={() => handleNextStep(userResponses[currentStep] || '')}
            className="flex items-center px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition-colors"
          >
            {currentStep === currentExercise.steps.length - 1 ? (
              <>
                <Check size={18} className="mr-2" />
                Complete Exercise
              </>
            ) : (
              <>
                <ArrowRight size={18} className="mr-2" />
                Next Step
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CBTExercises;