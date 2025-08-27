import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Grid, List, Search, Filter, Palette } from 'lucide-react';
import Dropdown, { DropdownItem } from './Dropdown';
import InputBar from './InputBar';
import { fadeIn, staggerChildren } from '../utils/animations';

interface LibraryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: Date;
}

interface LibraryProps {
  className?: string;
}

const Library: React.FC<LibraryProps> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All styles');

  // Mock data for the gallery
  const libraryImages: LibraryImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      title: 'Abstract Watercolor',
      description: 'Flowing watercolor painting with vibrant blues and purples',
      tags: ['watercolor', 'abstract', 'blue', 'purple'],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop',
      title: 'Digital Landscape',
      description: 'Surreal digital landscape with neon colors',
      tags: ['digital', 'landscape', 'neon', 'surreal'],
      createdAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1554053279-30c88a522aac?w=400&h=400&fit=crop',
      title: 'Geometric Pattern',
      description: 'Modern geometric pattern with bold shapes',
      tags: ['geometric', 'pattern', 'modern', 'bold'],
      createdAt: new Date('2024-01-13'),
    },
  ];

  const styleOptions: DropdownItem[] = [
    {
      label: 'All styles',
      onClick: () => setSelectedStyle('All styles'),
    },
    {
      label: 'Watercolor',
      onClick: () => setSelectedStyle('Watercolor'),
    },
    {
      label: 'Digital Art',
      onClick: () => setSelectedStyle('Digital Art'),
    },
  ];

  const filteredImages = libraryImages.filter((image) => {
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = selectedStyle === 'All styles' || 
                        image.tags.some(tag => tag.toLowerCase().includes(selectedStyle.toLowerCase()));
    return matchesSearch && matchesStyle;
  });

  const handleSendMessage = (message: string) => {
    console.log('Library message:', message);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-950 ${className}`}>
      <div className="flex-shrink-0 p-6 border-b border-gray-800">
        <h1 className="text-2xl font-semibold text-gray-200 mb-4">Library</h1>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <motion.div
          className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group cursor-pointer aspect-square"
              variants={fadeIn}
              custom={index}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-medium text-sm truncate">
                    {image.title}
                  </h3>
                  <p className="text-gray-300 text-xs truncate">
                    {image.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex-shrink-0 relative">
        <InputBar
          onSendMessage={handleSendMessage}
          placeholder="Create image, search library..."
          className="p-4"
        />
      </div>
    </div>
  );
};

export default Library;