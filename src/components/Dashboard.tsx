import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, subDays } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const moodChartData = {
    labels: Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'MMM dd')).reverse(),
    datasets: [{
      label: 'Mood Score',
      data: [3, 4, 5, 4, 6, 5, 7], // Sample data
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const sleepChartData = {
    labels: Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'MMM dd')).reverse(),
    datasets: [{
      label: 'Sleep Duration (hours)',
      data: [7, 6.5, 8, 7.5, 6, 8.5, 7], // Sample data
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  const exerciseChartData = {
    labels: Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'MMM dd')).reverse(),
    datasets: [{
      label: 'Exercise Duration (minutes)',
      data: [30, 45, 20, 60, 0, 30, 45], // Sample data
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome back, {userName}!
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            data-testid="mood-chart"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Mood Tracker</h2>
            <Line data={moodChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            data-testid="sleep-tracker"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Sleep Tracker</h2>
            <Bar data={sleepChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            data-testid="exercise-progress"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Exercise Tracker</h2>
            <Bar data={exerciseChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </motion.div>
        </div>
      </div>
  );
};

export default Dashboard;