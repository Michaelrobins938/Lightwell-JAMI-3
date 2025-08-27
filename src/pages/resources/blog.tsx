import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Heart, 
  Brain, 
  Shield,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

const MentalHealthBlog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Complete Guide',
      excerpt: 'Learn about the different types of anxiety, their causes, symptoms, and evidence-based treatment approaches.',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      readTime: '8 min',
      category: 'Anxiety',
      tags: ['anxiety', 'mental health', 'education'],
      featured: true,
    },
    {
      id: 2,
      title: 'The Science of Mindfulness and Meditation',
      excerpt: 'Explore the neuroscience behind mindfulness practices and their proven benefits for mental wellness.',
      author: 'Dr. Michael Chen',
      date: '2024-01-20',
      readTime: '12 min',
      category: 'Mindfulness',
      tags: ['mindfulness', 'meditation', 'neuroscience'],
      featured: true,
    },
    {
      id: 3,
      title: 'Depression: Signs, Symptoms, and Recovery',
      excerpt: 'A comprehensive overview of depression, including early warning signs and effective treatment strategies.',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-25',
      readTime: '10 min',
      category: 'Depression',
      tags: ['depression', 'mental health', 'recovery'],
      featured: true,
    },
    {
      id: 4,
      title: 'Building Resilience: Strategies for Mental Strength',
      excerpt: 'Discover practical techniques to build mental resilience and cope with life\'s challenges.',
      author: 'Dr. Lisa Park',
      date: '2024-02-01',
      readTime: '6 min',
      category: 'Resilience',
      tags: ['resilience', 'coping', 'mental strength'],
      featured: false,
    },
    {
      id: 5,
      title: 'Sleep and Mental Health: The Vital Connection',
      excerpt: 'How sleep quality affects your mental health and strategies for better sleep hygiene.',
      author: 'Dr. James Wilson',
      date: '2024-02-05',
      readTime: '7 min',
      category: 'Sleep',
      tags: ['sleep', 'mental health', 'wellness'],
      featured: false,
    },
    {
      id: 6,
      title: 'Digital Wellness: Managing Technology for Mental Health',
      excerpt: 'Balancing technology use with mental wellness in our digital age.',
      author: 'Dr. Alex Thompson',
      date: '2024-02-10',
      readTime: '9 min',
      category: 'Digital Wellness',
      tags: ['technology', 'digital wellness', 'mental health'],
      featured: false,
    },
  ];

  const categories = [
    { name: 'Anxiety', icon: <Brain className="w-5 h-5" />, count: 15 },
    { name: 'Depression', icon: <Heart className="w-5 h-5" />, count: 12 },
    { name: 'Mindfulness', icon: <Shield className="w-5 h-5" />, count: 8 },
    { name: 'Resilience', icon: <TrendingUp className="w-5 h-5" />, count: 10 },
    { name: 'Sleep', icon: <Clock className="w-5 h-5" />, count: 6 },
    { name: 'Digital Wellness', icon: <Lightbulb className="w-5 h-5" />, count: 4 },
  ];

  return (
    <Layout>
      <Head>
        <title>Mental Health Blog | Luna</title>
        <meta name="description" content="Expert mental health articles, research insights, and wellness tips from leading professionals." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-luna-50 to-luna-100 dark:from-luna-900 dark:to-luna-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-luna-800 dark:text-luna-200 mb-6">
              Mental Health Blog
            </h1>
            <p className="text-xl text-luna-600 dark:text-luna-400 max-w-3xl mx-auto">
              Expert insights, research updates, and practical strategies for mental wellness from leading professionals.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white dark:bg-luna-700 rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-center mb-2 text-luna-500 dark:text-luna-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-luna-700 dark:text-luna-300 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-luna-500 dark:text-luna-400">
                    {category.count} articles
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.filter(post => post.featured).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-luna-800 dark:text-luna-200 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-luna-500 dark:text-luna-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                      <button className="px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                        Read More
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* All Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-luna-800 dark:text-luna-200 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-luna-500 dark:text-luna-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                      <button className="px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                        Read More
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default MentalHealthBlog; 