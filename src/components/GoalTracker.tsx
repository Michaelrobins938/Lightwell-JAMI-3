import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    // Fetch goals from API
  };

  const addGoal = async () => {
    // Add new goal to API
  };

  const updateGoalProgress = async (id: string, progress: number) => {
    // Update goal progress in API
  };

  return (
    <div className="goal-tracker bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Goal Tracker</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Goal title"
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Goal description"
          value={newGoal.description}
          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={addGoal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Goal
        </button>
      </div>
      <div className="goals-list">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="goal-item bg-gray-100 dark:bg-gray-700 p-4 mb-4 rounded"
          >
            <h3 className="text-xl font-semibold">{goal.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                className="w-full"
              />
              <span>{goal.progress}% Complete</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}