import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MoodEntry {
  date: Date;
  text: string;
  sentiment: number;
}

const simpleSentimentAnalysis = (text: string): number => {
  const positiveWords = ['happy', 'joy', 'excited', 'great', 'good', 'wonderful', 'amazing'];
  const negativeWords = ['sad', 'angry', 'upset', 'bad', 'terrible', 'awful', 'horrible'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });
  
  return score;
};

const MoodJournal: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    const storedEntries = localStorage.getItem('moodEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (newEntry.trim()) {
      const sentimentScore = simpleSentimentAnalysis(newEntry);
      const newMoodEntry: MoodEntry = {
        date: new Date(),
        text: newEntry,
        sentiment: sentimentScore,
      };
      setEntries([...entries, newMoodEntry]);
      setNewEntry('');
    }
  };

  const chartData = {
    labels: entries.map(entry => format(new Date(entry.date), 'MM/dd/yyyy')),
    datasets: [
      {
        label: 'Mood Sentiment',
        data: entries.map(entry => entry.sentiment),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sentiment Score',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Sentiment: ${context.parsed.y}`,
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
      <h2 className="text-2xl font-bold mb-4">Mood Journal</h2>
      <textarea
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg resize-none dark:bg-luna-700 dark:text-luna-100"
        rows={4}
        placeholder="How are you feeling today?"
      />
      <button
        onClick={addEntry}
        className="mb-6 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition-colors"
      >
        Add Entry
      </button>
      <Line data={chartData} options={chartOptions} />
      <div className="mt-6 space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="border-b pb-2">
            <p className="text-sm text-gray-500">{format(new Date(entry.date), 'PPpp')}</p>
            <p>{entry.text}</p>
            <p className={`text-sm ${entry.sentiment > 0 ? 'text-green-500' : entry.sentiment < 0 ? 'text-red-500' : 'text-yellow-500'}`}>
              Sentiment: {entry.sentiment}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodJournal;