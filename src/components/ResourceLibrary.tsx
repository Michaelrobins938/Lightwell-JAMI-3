import React, { useState } from 'react';
import { Search, Book, Video, Headphones } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'audio';
  tags: string[];
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Cognitive Behavioral Therapy',
    description: 'An in-depth look at CBT techniques and their applications in various mental health conditions.',
    url: 'https://example.com/cbt-guide',
    type: 'article',
    tags: ['CBT', 'therapy', 'mental health'],
  },
  {
    id: '2',
    title: 'Mindfulness Meditation for Anxiety',
    description: 'A guided video session on mindfulness techniques to manage anxiety symptoms.',
    url: 'https://example.com/mindfulness-video',
    type: 'video',
    tags: ['mindfulness', 'anxiety', 'meditation'],
  },
  {
    id: '3',
    title: 'The Science of Attachment Theory',
    description: 'An audio lecture explaining attachment theory and its impact on relationships.',
    url: 'https://example.com/attachment-theory-podcast',
    type: 'audio',
    tags: ['attachment theory', 'relationships', 'psychology'],
  },
  // Add more resources here
];

const ResourceLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredResources = resources.filter(resource =>
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTags.length === 0 || selectedTags.some(tag => resource.tags.includes(tag)))
  );

  const allTags = Array.from(new Set(resources.flatMap(resource => resource.tags)));

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <Book size={24} />;
      case 'video':
        return <Video size={24} />;
      case 'audio':
        return <Headphones size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-luna-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Resource Library</h2>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded dark:bg-luna-700 dark:text-luna-100"
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-luna-500 text-white'
                : 'bg-gray-200 dark:bg-luna-700 text-gray-700 dark:text-luna-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {filteredResources.map(resource => (
          <li key={resource.id} className="border-b pb-4">
            <div className="flex items-start">
              <div className="mr-4 mt-1">{getResourceIcon(resource.type)}</div>
              <div>
                <h3 className="text-lg font-semibold">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-luna-500 hover:underline">
                    {resource.title}
                  </a>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{resource.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resource.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 dark:bg-luna-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceLibrary;