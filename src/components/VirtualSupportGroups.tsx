"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, Video } from 'lucide-react';

interface SupportGroup {
  id: number;
  name: string;
  description: string;
  schedule: {
    day: string;
    time: string;
  };
  participants: number;
  maxParticipants: number;
}

const VirtualSupportGroups: React.FC = () => {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/support-groups');
        if (!response.ok) {
          throw new Error('Failed to fetch support groups');
        }
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setGroups(data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setGroups([]);
        }
      } catch (err) {
        console.error('Error fetching support groups:', err);
        setError('Failed to load support groups');
        setGroups([]);
      }
    };
    fetchGroups();

    const storedJoinedGroups = localStorage.getItem('joinedSupportGroups');
    if (storedJoinedGroups) {
      setJoinedGroups(JSON.parse(storedJoinedGroups));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('joinedSupportGroups', JSON.stringify(joinedGroups));
  }, [joinedGroups]);

  const handleJoinGroup = (groupId: number) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Virtual Support Groups</h2>
        <p className="text-red-500 mt-4">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Virtual Support Groups</h2>
      {Array.isArray(groups) && groups.length > 0 ? (
        groups.map((group) => (
          <motion.div
            key={group.id}
            className="mb-6 p-4 border rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
            <p className="mb-2">{group.description}</p>
            <div className="flex items-center mb-2">
              <Calendar size={18} className="mr-2 text-luna-500" />
              <span>{group.schedule.day}</span>
              <Clock size={18} className="ml-4 mr-2 text-luna-500" />
              <span>{group.schedule.time}</span>
            </div>
            <div className="flex items-center mb-4">
              <Users size={18} className="mr-2 text-luna-500" />
              <span>{group.participants}/{group.maxParticipants} participants</span>
            </div>
            <button
              onClick={() => handleJoinGroup(group.id)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                joinedGroups.includes(group.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-luna-500 text-white hover:bg-luna-600'
              } transition-colors`}
              disabled={group.participants >= group.maxParticipants && !joinedGroups.includes(group.id)}
            >
              <Video size={18} className="mr-2" />
              {joinedGroups.includes(group.id) ? 'Leave Group' : 'Join Group'}
            </button>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500">Loading support groups...</p>
      )}
    </motion.div>
  );
};

export default VirtualSupportGroups;