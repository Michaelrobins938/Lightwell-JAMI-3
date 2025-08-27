import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Clock, TrendingUp, Plus, Edit, Trash2, Save, X, Calendar, BarChart3 } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { useRouter } from 'next/router';

interface SleepEntry {
  id: string;
  hours: number;
  quality: number;
  notes?: string;
  createdAt: string;
}

export default function SleepTracker() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    hours: 8,
    quality: 7,
    notes: ''
  });
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editData, setEditData] = useState({ hours: 8, quality: 7, notes: '' });
  const router = useRouter();

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const loadSleepEntries = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        // No token available - show empty state instead of redirecting
        setEntries([]);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/sleep', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.data || []);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to load sleep entries:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Load sleep entries on mount
  useEffect(() => {
    loadSleepEntries();
  }, [loadSleepEntries]);

  const handleAddEntry = async () => {
    if (!newEntry.hours || !newEntry.quality) return;

    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to save sleep entries');
        return;
      }

      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        const data = await response.json();
        setEntries([data.data, ...entries]);
        setNewEntry({ hours: 8, quality: 7, notes: '' });
        setShowAddEntry(false);
      }
    } catch (error) {
      console.error('Failed to add sleep entry:', error);
    }
  };

  const handleEditEntry = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to edit sleep entries');
        return;
      }

      const response = await fetch(`/api/sleep/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(entries.map(entry => entry.id === id ? data.data : entry));
        setEditingEntry(null);
      }
    } catch (error) {
      console.error('Failed to edit sleep entry:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to delete sleep entries');
        return;
      }

      const response = await fetch(`/api/sleep/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete sleep entry:', error);
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-500';
    if (quality >= 6) return 'text-yellow-500';
    if (quality >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 9) return 'Excellent';
    if (quality >= 8) return 'Great';
    if (quality >= 7) return 'Good';
    if (quality >= 6) return 'Fair';
    if (quality >= 5) return 'Poor';
    return 'Very Poor';
  };

  const getHoursQuality = (hours: number) => {
    if (hours >= 8) return 'text-green-500';
    if (hours >= 7) return 'text-yellow-500';
    if (hours >= 6) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sleep Tracker - Luna Mental Health</title>
        <meta name="description" content="Track your sleep patterns and quality with our sleep tracker." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              className="flex justify-between items-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Sleep Tracker</h1>
                <p className="text-slate-300">Monitor your sleep patterns and quality</p>
              </div>
              
              <button
                onClick={() => setShowAddEntry(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Add Entry</span>
              </button>
            </motion.div>

            {/* Add Entry Modal */}
            <AnimatePresence>
              {showAddEntry && (
                <motion.div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-slate-800 rounded-2xl p-6 w-full max-w-md"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white">Add Sleep Entry</h3>
                      <button
                        onClick={() => setShowAddEntry(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Hours Slept
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">0</span>
                        <input
                          type="range"
                          min="0"
                          max="16"
                          step="0.5"
                          value={newEntry.hours}
                          onChange={(e) => setNewEntry({ ...newEntry, hours: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-slate-400">16</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className={`text-lg font-semibold ${getHoursQuality(newEntry.hours)}`}>
                          {newEntry.hours} hours
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Sleep Quality (1-10)
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">1</span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={newEntry.quality}
                          onChange={(e) => setNewEntry({ ...newEntry, quality: parseInt(e.target.value) })}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-slate-400">10</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className={`text-lg font-semibold ${getQualityColor(newEntry.quality)}`}>
                          {newEntry.quality} - {getQualityLabel(newEntry.quality)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Notes (optional)
                      </label>
                      <textarea
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        placeholder="What affected your sleep quality?"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddEntry}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Save Entry
                      </button>
                      <button
                        onClick={() => setShowAddEntry(false)}
                        className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Moon className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300">Total Entries</span>
                </div>
                <div className="text-3xl font-bold text-white">{entries.length}</div>
              </div>
              
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">Avg. Hours</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {entries.length > 0 
                    ? (entries.reduce((sum, entry) => sum + entry.hours, 0) / entries.length).toFixed(1)
                    : '0.0'}
                </div>
              </div>
              
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Avg. Quality</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {entries.length > 0 
                    ? (entries.reduce((sum, entry) => sum + entry.quality, 0) / entries.length).toFixed(1)
                    : '0.0'}
                </div>
              </div>
            </motion.div>

            {/* Sleep Entries */}
            <motion.div
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Recent Entries</h2>
              
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <Moon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">No sleep entries yet</h3>
                  <p className="text-slate-500 mb-4">Start tracking your sleep to see patterns and insights</p>
                  <button
                    onClick={() => setShowAddEntry(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Add Your First Entry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {editingEntry === entry.id ? (
                        <div>
                          <div className="mb-4">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                              Hours Slept
                            </label>
                            <div className="flex items-center space-x-4">
                              <span className="text-slate-400">0</span>
                              <input
                                type="range"
                                min="0"
                                max="16"
                                step="0.5"
                                value={editData.hours}
                                onChange={(e) => setEditData({ ...editData, hours: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-slate-400">16</span>
                            </div>
                            <div className="text-center mt-2">
                              <span className={`text-lg font-semibold ${getHoursQuality(editData.hours)}`}>
                                {editData.hours} hours
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                              Sleep Quality (1-10)
                            </label>
                            <div className="flex items-center space-x-4">
                              <span className="text-slate-400">1</span>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={editData.quality}
                                onChange={(e) => setEditData({ ...editData, quality: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-slate-400">10</span>
                            </div>
                            <div className="text-center mt-2">
                              <span className={`text-lg font-semibold ${getQualityColor(editData.quality)}`}>
                                {editData.quality} - {getQualityLabel(editData.quality)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                              Notes
                            </label>
                            <textarea
                              value={editData.notes}
                              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEntry(entry.id)}
                              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-all"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingEntry(null)}
                              className="flex items-center space-x-1 bg-slate-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-slate-700 transition-all"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className={`font-semibold ${getHoursQuality(entry.hours)}`}>
                                  {entry.hours}h
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <BarChart3 className="w-4 h-4 text-slate-400" />
                                <span className={`font-semibold ${getQualityColor(entry.quality)}`}>
                                  {entry.quality}/10
                                </span>
                              </div>
                              <span className="text-slate-500 text-sm">
                                {new Date(entry.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {entry.notes && (
                              <p className="text-slate-300 text-sm">{entry.notes}</p>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingEntry(entry.id);
                                setEditData({ hours: entry.hours, quality: entry.quality, notes: entry.notes || '' });
                              }}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}