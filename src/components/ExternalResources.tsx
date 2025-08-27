import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

export default function ExternalResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    // Implement API call here
  };

  const filterResources = () => {
    if (!selectedCategory) return resources;
    return resources.filter(resource => resource.category === selectedCategory);
  };

  return (
    <div className="external-resources bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">External Resources</h2>
      <div className="category-filter mb-4">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="articles">Articles</option>
          <option value="videos">Videos</option>
          <option value="services">Professional Services</option>
        </select>
      </div>
      <div className="resources-list">
        {filterResources().map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="resource-item bg-gray-100 dark:bg-gray-700 p-4 mb-4 rounded"
          >
            <h3 className="text-xl font-semibold">{resource.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{resource.description}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Learn More
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
