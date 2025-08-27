import React, { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import ClientOnly from './ClientOnly';

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
}

const JournalPrompt: React.FC<{ userId: string }> = ({ userId }) => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const fetchJournalEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/journal-entries?userId=${userId}`);
      if (response.ok) {
        const entries = await response.json();
        setJournalEntries(entries);
      }
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);
    }
  }, [userId]);

  const generateNewPrompt = async () => {
    try {
      const response = await fetch('/api/generate-prompt');
      if (response.ok) {
        const { prompt } = await response.json();
        setCurrentPrompt(prompt);
      }
    } catch (error) {
      console.error('Failed to generate prompt:', error);
    }
  };

  useEffect(() => {
    fetchJournalEntries();
    generateNewPrompt();
  }, [fetchJournalEntries]);

  const handleSaveEntry = async () => {
    if (journalContent.trim()) {
      try {
        const response = await fetch('/api/journal-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            prompt: currentPrompt,
            content: journalContent,
            date: new Date().toISOString(),
          }),
        });
        if (response.ok) {
          await fetchJournalEntries();
          setJournalContent('');
          generateNewPrompt();
        }
      } catch (error) {
        console.error('Failed to save journal entry:', error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-luna-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Journal Prompt</h2>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg font-semibold">{currentPrompt}</p>
        <button
          onClick={generateNewPrompt}
          className="bg-luna-500 text-white p-2 rounded-full hover:bg-luna-600 transition-colors"
          aria-label="Generate new prompt"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      <textarea
        value={journalContent}
        onChange={(e) => setJournalContent(e.target.value)}
        className="w-full p-2 border rounded dark:bg-luna-700 dark:text-luna-100 mb-4"
        rows={10}
        placeholder="Start writing your journal entry here..."
      />
      <button
        onClick={handleSaveEntry}
        className="bg-luna-500 text-white px-4 py-2 rounded hover:bg-luna-600 transition-colors flex items-center"
      >
        <Save size={18} className="mr-2" />
        Save Entry
      </button>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Previous Entries</h3>
        <ul className="space-y-4">
          {journalEntries.slice().reverse().map((entry) => (
            <li key={entry.id} className="border-b pb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <ClientOnly>{new Date(entry.date).toLocaleString()}</ClientOnly>
              </p>
              <p className="font-semibold mt-1">{entry.prompt}</p>
              <p className="mt-2">{entry.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JournalPrompt;