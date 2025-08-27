import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Brain, 
  Heart, 
  Shield, 
  Users, 
  Globe, 
  Clock, 
  Star,
  ChevronDown,
  ChevronUp,
  X,
  Book,
  Lightbulb,
  Wrench,
  AlertTriangle,
  User,
  FileText,
  Video,
  Headphones,
  Download,
  Share2,
  Bookmark,
  Eye
} from 'lucide-react';
import { 
  educationalContent, 
  EducationalContent, 
  contentCategories, 
  contentTypes, 
  languages, 
  difficultyLevels 
} from '../data/educationalContent';

interface EducationalContentLibraryProps {
  className?: string;
}

const EducationalContentLibrary: React.FC<EducationalContentLibraryProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title' | 'readTime'>('recent');

  const filteredContent = useMemo(() => {
    return educationalContent.filter(content => {
      const matchesSearch = 
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(content.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(content.type);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(content.language);
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(content.difficulty);

      return matchesSearch && matchesCategory && matchesType && matchesLanguage && matchesDifficulty;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return (a.readTime || 0) - (b.readTime || 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategories, selectedTypes, selectedLanguages, selectedDifficulties, sortBy]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-5 h-5" />;
      case 'coping-strategy':
        return <Brain className="w-5 h-5" />;
      case 'self-help-tool':
        return <Wrench className="w-5 h-5" />;
      case 'expert-insight':
        return <Lightbulb className="w-5 h-5" />;
      case 'crisis-resource':
        return <AlertTriangle className="w-5 h-5" />;
      case 'personalized':
        return <User className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const stats = {
    totalArticles: educationalContent.length,
    totalTopics: contentCategories.length,
    totalLanguages: languages.length,
    featuredContent: educationalContent.filter(c => c.featured).length,
  };

  return (
    <div className={`bg-white dark:bg-luna-800 rounded-xl shadow-xl overflow-hidden ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-luna-500 to-dream-500 p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Educational Content Library</h1>
          <p className="text-xl opacity-90 mb-6">
            Comprehensive mental health resources, articles, and tools to support your wellness journey and personal growth.
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.totalArticles}+</div>
              <div className="text-sm opacity-90">Articles</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.totalTopics}+</div>
              <div className="text-sm opacity-90">Topics</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.totalLanguages}+</div>
              <div className="text-sm opacity-90">Languages</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.featuredContent}</div>
              <div className="text-sm opacity-90">Featured</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-luna-200 dark:border-luna-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luna-400" size={20} />
            <input
              type="text"
              placeholder="Search educational content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-luna-300 focus:border-luna-500 focus:ring focus:ring-luna-200 focus:ring-opacity-50 transition duration-300 bg-white dark:bg-luna-700 dark:border-luna-600 dark:focus:border-luna-400 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-lg bg-luna-500 text-white transition duration-300 hover:bg-luna-600 flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </motion.button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-lg border-2 border-luna-300 focus:border-luna-500 focus:ring focus:ring-luna-200 focus:ring-opacity-50 transition duration-300 bg-white dark:bg-luna-700 dark:border-luna-600 dark:focus:border-luna-400 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="title">Alphabetical</option>
              <option value="readTime">Read Time</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-luna-200 dark:border-luna-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Categories</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {contentCategories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                          className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                        />
                        <span className="text-sm text-luna-600 dark:text-luna-400">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Types Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Content Types</h3>
                  <div className="space-y-2">
                    {contentTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypes([...selectedTypes, type]);
                            } else {
                              setSelectedTypes(selectedTypes.filter(t => t !== type));
                            }
                          }}
                          className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                        />
                        <span className="text-sm text-luna-600 dark:text-luna-400 capitalize">{type.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Languages Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Languages</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {languages.slice(0, 10).map(language => (
                      <label key={language} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLanguages([...selectedLanguages, language]);
                            } else {
                              setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                            }
                          }}
                          className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                        />
                        <span className="text-sm text-luna-600 dark:text-luna-400">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Difficulty</h3>
                  <div className="space-y-2">
                    {difficultyLevels.map(difficulty => (
                      <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDifficulties.includes(difficulty)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDifficulties([...selectedDifficulties, difficulty]);
                            } else {
                              setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
                            }
                          }}
                          className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                        />
                        <span className="text-sm text-luna-600 dark:text-luna-400 capitalize">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedTypes([]);
                    setSelectedLanguages([]);
                    setSelectedDifficulties([]);
                  }}
                  className="px-4 py-2 text-sm text-luna-600 dark:text-luna-400 hover:text-luna-800 dark:hover:text-luna-200 transition duration-300"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Grid */}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300">
            {filteredContent.length} {filteredContent.length === 1 ? 'Result' : 'Results'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden border border-luna-200 dark:border-luna-600 hover:shadow-xl transition-all duration-300"
              >
                {/* Content Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300">
                        {getTypeIcon(content.type)}
                      </div>
                      {content.featured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-luna-500 dark:text-luna-400">
                      <Clock className="w-4 h-4" />
                      <span>{content.readTime} min</span>
                    </div>
                  </div>

                  {/* Content Title and Description */}
                  <h3 className="text-lg font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                    {content.title}
                  </h3>
                  <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                    {content.description}
                  </p>

                  {/* Tags and Difficulty */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                      {content.difficulty}
                    </span>
                    {content.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author and Language */}
                  <div className="flex items-center justify-between text-sm text-luna-500 dark:text-luna-400 mb-4">
                    <span>{content.author}</span>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>{content.language}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button className="px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                      Read More
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredContent.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-luna-400 dark:text-luna-500 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-luna-600 dark:text-luna-400 mb-2">
              No content found
            </h3>
            <p className="text-luna-500 dark:text-luna-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EducationalContentLibrary; 