import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface StressCategory {
  id: string;
  name: string;
  questions: string[];
}

interface StressScore {
  [key: string]: number;
}

const StressAssessment: React.FC = () => {
  const [categories, setCategories] = useState<StressCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<StressCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<StressScore>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  useEffect(() => {
    fetchStressCategories();
  }, []);

  const fetchStressCategories = async () => {
    try {
      const response = await fetch('/api/stress-categories');
      const data = await response.json();
      setCategories(data);
      setCurrentCategory(data[0]);
    } catch (error) {
      console.error('Failed to fetch stress categories:', error);
    }
  };

  const handleAnswer = (score: number) => {
    if (!currentCategory) return;  // Add this check

    setScores(prevScores => ({
      ...prevScores,
      [currentCategory.id]: (prevScores[currentCategory.id] || 0) + score
    }));

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const currentCategoryIndex = categories.findIndex(cat => cat.id === currentCategory.id);
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategory(categories[currentCategoryIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        setAssessmentComplete(true);
      }
    }
  };

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [{
      label: 'Stress Levels',
      data: categories.map(cat => scores[cat.id] || 0),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 10
      }
    }
  };

  if (!currentCategory) {
    return <div>Loading...</div>;  // Add this loading state
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Stress Assessment</h2>
      {!assessmentComplete ? (
        <motion.div
          key="question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-xl mb-4">{currentCategory.name}</h3>
          <p className="mb-4">{currentCategory.questions[currentQuestionIndex]}</p>
          <div className="flex justify-between">
            {[0, 1, 2, 3, 4].map(score => (
              <button
                key={score}
                onClick={() => handleAnswer(score)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {score}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl mb-4">Your Stress Assessment Results</h3>
          <Radar data={chartData} options={chartOptions} />
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Recommendations:</h4>
            <ul className="list-disc pl-5">
              {categories.map(cat => (
                <li key={cat.id}>
                  {cat.name}: {getRecommendation(scores[cat.id] || 0)}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const getRecommendation = (score: number): string => {
  if (score <= 5) return "Your stress level is low. Keep up the good work!";
  if (score <= 10) return "Moderate stress detected. Consider incorporating stress-reduction techniques.";
  return "High stress detected. We recommend consulting with a mental health professional.";
};

export default StressAssessment;