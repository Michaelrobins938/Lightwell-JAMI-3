import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Save, Trash2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MOOD_LEVELS = {
  'Very Negative': 1,
  'Negative': 2,
  'Neutral': 3,
  'Positive': 4,
  'Very Positive': 5,
};

interface MoodEntry {
  id: string;
  date: string;
  level: number;
  notes: string;
}

const MoodTracker: React.FC<{ userId: string }> = ({ userId }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [moodNotes, setMoodNotes] = useState<string>('');

  const fetchMoodEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/mood-entries?userId=${userId}`);
      if (response.ok) {
        const entries = await response.json();
        setMoodEntries(entries);
      }
    } catch (error) {
      console.error('Failed to fetch mood entries:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  const handleSaveMood = async () => {
    try {
      const response = await fetch('/api/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          level: currentMood,
          notes: moodNotes,
          date: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        await fetchMoodEntries();
        setMoodNotes('');
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/mood-entries/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchMoodEntries();
      }
    } catch (error) {
      console.error('Failed to delete mood entry:', error);
    }
  };

  const chartData = {
    labels: moodEntries.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood Level',
        data: moodEntries.map(entry => entry.level),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const chartOptions: any = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: number) {
            return Object.keys(MOOD_LEVELS)[value - 1] || '';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-luna-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mood Tracker</h2>
      <div className="mb-6">
        <label className="block mb-2">Current Mood:</label>
        <input
          type="range"
          min="1"
          max="5"
          value={currentMood}
          onChange={(e) => setCurrentMood(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          {Object.keys(MOOD_LEVELS).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Notes:</label>
        <textarea
          value={moodNotes}
          onChange={(e) => setMoodNotes(e.target.value)}
          className="w-full p-2 border rounded dark:bg-luna-700 dark:text-luna-100"
          rows={3}
        />
      </div>
      <button
        onClick={handleSaveMood}
        className="bg-luna-500 text-white px-4 py-2 rounded hover:bg-luna-600 transition-colors flex items-center"
      >
        <Save size={18} className="mr-2" />
        Save Mood Entry
      </button>
      <div className="mt-8">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Mood History</h3>
        <ul>
          {moodEntries.map((entry) => (
            <li key={entry.id} className="mb-2 flex justify-between items-center">
              <span>
                {new Date(entry.date).toLocaleString()}: {Object.keys(MOOD_LEVELS)[entry.level - 1]}
                {entry.notes && ` - ${entry.notes}`}
              </span>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoodTracker;