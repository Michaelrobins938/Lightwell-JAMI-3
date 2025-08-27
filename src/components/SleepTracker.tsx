import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, subDays } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SleepData {
  date: Date;
  duration: number;
  quality: number;
}

const SleepTracker: React.FC = () => {
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [duration, setDuration] = useState('');
  const [quality, setQuality] = useState(5);

  useEffect(() => {
    const storedData = localStorage.getItem('sleepData');
    if (storedData) {
      setSleepData(JSON.parse(storedData).map((item: SleepData) => ({ ...item, date: new Date(item.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sleepData', JSON.stringify(sleepData));
  }, [sleepData]);

  const addSleepData = () => {
    if (duration) {
      const newData: SleepData = {
        date: new Date(),
        duration: parseFloat(duration),
        quality: quality,
      };
      setSleepData([...sleepData, newData]);
      setDuration('');
      setQuality(5);
    }
  };

  const chartData = {
    labels: sleepData.slice(-7).map(data => format(data.date, 'MM/dd')),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: sleepData.slice(-7).map(data => data.duration),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Sleep Quality (1-10)',
        data: sleepData.slice(-7).map(data => data.quality),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours / Quality',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Sleep Tracker</h2>
      <div className="mb-4">
        <label className="block mb-2">Sleep Duration (hours)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-luna-700 dark:text-luna-100"
          step="0.5"
          min="0"
          max="24"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Sleep Quality (1-10)</label>
        <input
          type="range"
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          className="w-full"
          min="1"
          max="10"
        />
        <span>{quality}</span>
      </div>
      <button
        onClick={addSleepData}
        className="mb-6 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition-colors"
      >
        Add Sleep Data
      </button>
      <Bar data={chartData} options={chartOptions} />
    </motion.div>
  );
};

export default SleepTracker;