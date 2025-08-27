import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
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
  GraduationCap,
  Calendar,
  Tag,
  Globe
} from 'lucide-react';
import { comprehensiveContentData, ComprehensiveContent } from '../../../data/comprehensiveEducationalContent';
import { Layout } from '../../../components/layout/Layout';
import { showDownloadFormatDialog } from '../../../utils/downloadUtils';



interface ArticlePageProps {
  article: (Omit<ComprehensiveContent, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  }) | null;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  const router = useRouter();

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-luna-50 to-luna-100 dark:from-luna-900 dark:to-luna-800">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-luna-800 rounded-xl shadow-xl p-8 text-center"
            >
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-luna-800 dark:text-luna-200 mb-4">
                Article Not Found
              </h1>
              <p className="text-luna-600 dark:text-luna-400 mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dsm5-coverage':
        return <GraduationCap className="w-6 h-6" />;
      case 'research-study':
        return <Microscope className="w-6 h-6" />;
      case 'interactive-assessment':
        return <Wrench className="w-6 h-6" />;
      case 'treatment-guide':
        return <Award className="w-6 h-6" />;
      case 'crisis-resource':
        return <AlertTriangle className="w-6 h-6" />;
      case 'expert-insight':
        return <Brain className="w-6 h-6" />;
      case 'coping-strategy':
        return <Heart className="w-6 h-6" />;
      case 'self-help-tool':
        return <Wrench className="w-6 h-6" />;
      case 'personalized':
        return <User className="w-6 h-6" />;
      case 'article':
        return <FileText className="w-6 h-6" />;
      default:
        return <Book className="w-6 h-6" />;
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
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-luna-50 to-luna-100 dark:from-luna-900 dark:to-luna-800">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-luna-600 dark:text-luna-400 hover:text-luna-800 dark:hover:text-luna-200 mb-6 transition duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Resources</span>
          </motion.button>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-luna-800 rounded-xl shadow-xl overflow-hidden mb-8"
          >
            {/* Article Header */}
            <div className="p-8 border-b border-luna-200 dark:border-luna-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300">
                    {getTypeIcon(article.type)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-luna-800 dark:text-luna-200 mb-2">
                      {article.title}
                    </h1>
                    <p className="text-lg text-luna-600 dark:text-luna-400">
                      {article.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-luna-500 dark:text-luna-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} min read</span>
                  </div>
                  {article.featured && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Meta */}
              <div className="flex flex-wrap gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
                  {article.difficulty}
                </span>
                {article.evidenceLevel && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEvidenceLevelColor(article.evidenceLevel)}`}>
                    {getEvidenceLevelText(article.evidenceLevel)}
                  </span>
                )}
                {article.researchYear && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                    Research {article.researchYear}
                  </span>
                )}
                {article.dsm5Category && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium">
                    DSM-5: {article.dsm5Category}
                  </span>
                )}
              </div>

              {/* Article Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-luna-500 dark:text-luna-400">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Author: {article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Language: {article.language}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium text-luna-600 dark:text-luna-300">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Elements */}
              {article.interactiveElements && article.interactiveElements.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Wrench className="w-4 h-4" />
                    <span className="text-sm font-medium text-luna-600 dark:text-luna-300">Interactive Elements:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.interactiveElements.map(element => (
                      <span key={element} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

                         {/* Article Content */}
             <div className="p-8">
               <div className="prose prose-lg max-w-none dark:prose-invert">
                 <div 
                   className="text-luna-700 dark:text-luna-300 leading-relaxed"
                 >
                   {article.content}
                 </div>
               </div>
             </div>

            {/* Article Actions */}
            <div className="p-8 border-t border-luna-200 dark:border-luna-700 bg-luna-50 dark:bg-luna-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {article.downloadable && (
                    <button 
                      onClick={() => showDownloadFormatDialog(article.id, article.title)}
                      className="flex items-center space-x-2 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                  {article.videoUrl && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
                      <Video className="w-4 h-4" />
                      <span>Watch Video</span>
                    </button>
                  )}
                  {article.audioUrl && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300">
                      <Headphones className="w-4 h-4" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  // Find the article by ID
  const article = comprehensiveContentData.find(content => content.id === id) || null;

  // Convert Date objects to ISO strings to make them JSON serializable
  if (article) {
    const serializedArticle = {
      ...article,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
    
    return {
      props: {
        article: serializedArticle,
      },
    };
  }

  return {
    props: {
      article: null,
    },
  };
};

export default ArticlePage; 