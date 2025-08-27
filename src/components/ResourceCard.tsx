import React from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {resource.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags && resource.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={resource.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;