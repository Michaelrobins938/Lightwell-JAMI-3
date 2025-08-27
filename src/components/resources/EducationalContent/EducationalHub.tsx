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
  Eye,
  GraduationCap,
  Microscope,
  Zap,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import ContentCategories from './ContentCategories';
import ArticleCard from './ArticleCard';
import InteractiveTools from './InteractiveTools';
import ResearchUpdates from './ResearchUpdates';
import AssessmentTools from './AssessmentTools';
import CrisisResources from './CrisisResources';
import { comprehensiveContentData } from '../../../data/comprehensiveEducationalContent';

interface EducationalHubProps {
  className?: string;
}

const EducationalHub: React.FC<EducationalHubProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title' | 'readTime'>('recent');
  const [activeSection, setActiveSection] = useState<'overview' | 'dsm5' | 'research' | 'tools' | 'crisis'>('overview');

  const filteredContent = useMemo(() => {
    return comprehensiveContentData.filter(content => {
      const matchesSearch = 
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(content.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(content.type);
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(content.difficulty);

      return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
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
  }, [searchTerm, selectedCategories, selectedTypes, selectedDifficulties, sortBy]);

  const stats = {
    totalArticles: comprehensiveContentData.length,
    dsm5Categories: 22,
    researchStudies: 150,
    interactiveTools: 25,
    crisisResources: 12,
  };

  return (
    <div className={`bg-white dark:bg-luna-800 rounded-xl shadow-xl overflow-hidden ${className}`}>
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-luna-500 via-dream-500 to-purple-600 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Comprehensive Mental Health Education</h1>
          </div>
          <p className="text-xl opacity-90 mb-6 max-w-3xl">
            The world's most complete mental health education library featuring DSM-5 coverage, 
            latest research, interactive tools, and evidence-based resources for professionals and individuals.
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <div className="text-2xl font-bold">{stats.dsm5Categories}</div>
              <div className="text-sm opacity-90">DSM-5 Categories</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.researchStudies}+</div>
              <div className="text-sm opacity-90">Research Studies</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.interactiveTools}</div>
              <div className="text-sm opacity-90">Interactive Tools</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold">{stats.crisisResources}</div>
              <div className="text-sm opacity-90">Crisis Resources</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-luna-200 dark:border-luna-700">
        <div className="flex flex-wrap justify-center space-x-1 p-4">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'dsm5', label: 'DSM-5 Complete', icon: Brain },
            { id: 'research', label: 'Latest Research', icon: Microscope },
            { id: 'tools', label: 'Interactive Tools', icon: Wrench },
            { id: 'crisis', label: 'Crisis Resources', icon: AlertTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeSection === tab.id
                  ? 'bg-luna-500 text-white shadow-lg'
                  : 'text-luna-600 dark:text-luna-400 hover:text-luna-700 dark:hover:text-luna-300 hover:bg-luna-100 dark:hover:bg-luna-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-luna-200 dark:border-luna-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luna-400" size={20} />
            <input
              type="text"
              placeholder="Search comprehensive content..."
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
              <ContentCategories
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedDifficulties={selectedDifficulties}
                setSelectedDifficulties={setSelectedDifficulties}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Sections */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-4">
                  {filteredContent.length} {filteredContent.length === 1 ? 'Result' : 'Results'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredContent.slice(0, 9).map((content, index) => (
                    <ArticleCard key={content.id} content={content} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeSection === 'dsm5' && (
            <motion.div
              key="dsm5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-4">
                  DSM-5 Complete Coverage
                </h2>
                <p className="text-luna-600 dark:text-luna-400 mb-6">
                  Comprehensive coverage of all 22 DSM-5 diagnostic categories with detailed explanations, 
                  symptoms, treatments, and evidence-based interventions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredContent
                    .filter(content => content.category.includes('DSM-5') || content.tags.includes('dsm-5'))
                    .slice(0, 9)
                    .map((content, index) => (
                      <ArticleCard key={content.id} content={content} index={index} />
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeSection === 'research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResearchUpdates />
            </motion.div>
          )}

          {activeSection === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InteractiveTools />
              <AssessmentTools />
            </motion.div>
          )}

          {activeSection === 'crisis' && (
            <motion.div
              key="crisis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CrisisResources />
            </motion.div>
          )}
        </AnimatePresence>

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

export default EducationalHub; 