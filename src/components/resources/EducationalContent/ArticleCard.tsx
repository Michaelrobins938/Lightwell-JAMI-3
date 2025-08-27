import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Clock, 
  Star, 
  Book, 
  Brain, 
  Heart, 
  Shield, 
  User, 
  FileText, 
  Video, 
  Headphones, 
  Download, 
  Share2, 
  Bookmark, 
  Eye,
  Award,
  TrendingUp,
  Microscope,
  Wrench,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { ComprehensiveContent } from '../../../data/comprehensiveEducationalContent';

interface ArticleCardProps {
  content: ComprehensiveContent;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ content, index }) => {
  const router = useRouter();

  const handleReadMore = () => {
    // Navigate to the article reading page
    router.push(`/resources/article/${content.id}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dsm5-coverage':
        return <GraduationCap className="w-5 h-5" />;
      case 'research-study':
        return <Microscope className="w-5 h-5" />;
      case 'interactive-assessment':
        return <Wrench className="w-5 h-5" />;
      case 'treatment-guide':
        return <Award className="w-5 h-5" />;
      case 'crisis-resource':
        return <AlertTriangle className="w-5 h-5" />;
      case 'expert-insight':
        return <Brain className="w-5 h-5" />;
      case 'coping-strategy':
        return <Heart className="w-5 h-5" />;
      case 'self-help-tool':
        return <Wrench className="w-5 h-5" />;
      case 'personalized':
        return <User className="w-5 h-5" />;
      case 'article':
        return <FileText className="w-5 h-5" />;
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

  const getEvidenceLevelColor = (level?: string) => {
    switch (level) {
      case 'level-1':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'level-2':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'level-3':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'level-4':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'level-5':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEvidenceLevelText = (level?: string) => {
    switch (level) {
      case 'level-1':
        return 'Systematic Review';
      case 'level-2':
        return 'RCT';
      case 'level-3':
        return 'Cohort Study';
      case 'level-4':
        return 'Case Control';
      case 'level-5':
        return 'Expert Opinion';
      default:
        return '';
    }
  };

  return (
    <motion.div
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
            {content.researchYear && (
              <TrendingUp className="w-5 h-5 text-blue-500" />
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
          {content.evidenceLevel && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEvidenceLevelColor(content.evidenceLevel)}`}>
              {getEvidenceLevelText(content.evidenceLevel)}
            </span>
          )}
          {content.researchYear && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
              {content.researchYear}
            </span>
          )}
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
            <Eye className="w-4 h-4" />
            <span>{content.language}</span>
          </div>
        </div>

        {/* Interactive Elements Indicator */}
        {content.interactiveElements && content.interactiveElements.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-luna-500 dark:text-luna-400">
              <Wrench className="w-4 h-4" />
              <span>Interactive: {content.interactiveElements.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleReadMore}
            className="px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium"
          >
            Read More
          </button>
          <div className="flex items-center space-x-2">
            {content.downloadable && (
              <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                <Download className="w-4 h-4" />
              </button>
            )}
            {content.videoUrl && (
              <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                <Video className="w-4 h-4" />
              </button>
            )}
            {content.audioUrl && (
              <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                <Headphones className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard; 