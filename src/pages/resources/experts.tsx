import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { 
  User, 
  Brain, 
  Heart, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  TrendingUp,
  Zap,
  BookOpen,
  Lightbulb,
  Award,
  MessageCircle,
  Calendar
} from 'lucide-react';

const ExpertAdvice: React.FC = () => {
  const experts = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist',
      specialization: 'Anxiety & Depression',
      credentials: 'PhD, Licensed Clinical Psychologist',
      experience: '15+ years',
      avatar: '/experts/dr-sarah-johnson.jpg',
      bio: 'Specializing in evidence-based treatments for anxiety and depression, with expertise in CBT and mindfulness-based interventions.',
      articles: 25,
      consultations: 1500,
      rating: 4.9,
      featured: true,
      insights: [
        'Understanding the connection between thoughts and emotions',
        'Building resilience through cognitive restructuring',
        'Mindfulness techniques for daily stress management'
      ]
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      title: 'Psychiatrist',
      specialization: 'Mood Disorders & Medication',
      credentials: 'MD, Board Certified Psychiatrist',
      experience: '12+ years',
      avatar: '/experts/dr-michael-chen.jpg',
      bio: 'Expert in psychopharmacology and treatment-resistant depression, with a focus on personalized medication management.',
      articles: 18,
      consultations: 1200,
      rating: 4.8,
      featured: true,
      insights: [
        'When medication might be helpful for mental health',
        'Understanding treatment-resistant depression',
        'The role of genetics in mental health treatment'
      ]
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      title: 'Licensed Clinical Social Worker',
      specialization: 'Trauma & PTSD',
      credentials: 'LCSW, EMDR Certified',
      experience: '10+ years',
      avatar: '/experts/dr-emily-rodriguez.jpg',
      bio: 'Specializing in trauma-informed care and EMDR therapy for individuals with PTSD and complex trauma.',
      articles: 22,
      consultations: 900,
      rating: 4.9,
      featured: false,
      insights: [
        'Understanding trauma responses and healing',
        'EMDR therapy for PTSD treatment',
        'Building safety and trust in therapy'
      ]
    },
    {
      id: 4,
      name: 'Dr. Lisa Park',
      title: 'Child & Adolescent Psychologist',
      specialization: 'Youth Mental Health',
      credentials: 'PhD, Licensed Child Psychologist',
      experience: '8+ years',
      avatar: '/experts/dr-lisa-park.jpg',
      bio: 'Expert in child and adolescent mental health, specializing in developmental disorders and family therapy.',
      articles: 15,
      consultations: 800,
      rating: 4.7,
      featured: false,
      insights: [
        'Supporting children with anxiety and depression',
        'Parenting strategies for mental health',
        'Early intervention for developmental concerns'
      ]
    },
    {
      id: 5,
      name: 'Dr. James Wilson',
      title: 'Addiction Specialist',
      specialization: 'Substance Use & Recovery',
      credentials: 'MD, Addiction Medicine Certified',
      experience: '14+ years',
      avatar: '/experts/dr-james-wilson.jpg',
      bio: 'Specializing in addiction treatment and recovery support, with expertise in dual diagnosis and harm reduction.',
      articles: 20,
      consultations: 1100,
      rating: 4.8,
      featured: false,
      insights: [
        'Understanding addiction as a brain disease',
        'Harm reduction approaches to recovery',
        'Supporting loved ones in recovery'
      ]
    },
    {
      id: 6,
      name: 'Dr. Alex Thompson',
      title: 'Marriage & Family Therapist',
      specialization: 'Relationships & Couples',
      credentials: 'LMFT, Gottman Method Certified',
      experience: '11+ years',
      avatar: '/experts/dr-alex-thompson.jpg',
      bio: 'Expert in relationship counseling and family therapy, helping couples build stronger, healthier relationships.',
      articles: 16,
      consultations: 950,
      rating: 4.9,
      featured: false,
      insights: [
        'Building healthy communication in relationships',
        'Managing conflict constructively',
        'Strengthening emotional intimacy'
      ]
    }
  ];

  const expertArticles = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Complete Guide',
      author: 'Dr. Sarah Johnson',
      excerpt: 'Learn about the different types of anxiety, their causes, symptoms, and evidence-based treatment approaches.',
      readTime: '8 min',
      category: 'Anxiety',
      featured: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'The Science of Mindfulness and Meditation',
      author: 'Dr. Michael Chen',
      excerpt: 'Explore the neuroscience behind mindfulness practices and their proven benefits for mental wellness.',
      readTime: '12 min',
      category: 'Mindfulness',
      featured: true,
      date: '2024-01-20'
    },
    {
      id: 3,
      title: 'Depression: Signs, Symptoms, and Recovery',
      author: 'Dr. Emily Rodriguez',
      excerpt: 'A comprehensive overview of depression, including early warning signs and effective treatment strategies.',
      readTime: '10 min',
      category: 'Depression',
      featured: true,
      date: '2024-01-25'
    },
    {
      id: 4,
      title: 'Building Resilience: Strategies for Mental Strength',
      author: 'Dr. Lisa Park',
      excerpt: 'Discover practical techniques to build mental resilience and cope with life\'s challenges.',
      readTime: '6 min',
      category: 'Resilience',
      featured: false,
      date: '2024-02-01'
    },
    {
      id: 5,
      title: 'Sleep and Mental Health: The Vital Connection',
      author: 'Dr. James Wilson',
      excerpt: 'How sleep quality affects your mental health and strategies for better sleep hygiene.',
      readTime: '7 min',
      category: 'Sleep',
      featured: false,
      date: '2024-02-05'
    },
    {
      id: 6,
      title: 'Digital Wellness: Managing Technology for Mental Health',
      author: 'Dr. Alex Thompson',
      excerpt: 'Balancing technology use with mental wellness in our digital age.',
      readTime: '9 min',
      category: 'Digital Wellness',
      featured: false,
      date: '2024-02-10'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Expert Advice | Luna</title>
        <meta name="description" content="Expert mental health advice and insights from licensed professionals and specialists." />
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
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-luna-500 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-luna-800 dark:text-luna-200 mb-6">
              Expert Advice
            </h1>
            <p className="text-xl text-luna-600 dark:text-luna-400 max-w-3xl mx-auto">
              Insights and guidance from licensed mental health professionals and specialists in various fields of psychology and psychiatry.
            </p>
          </motion.div>

          {/* Featured Experts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Featured Experts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.filter(expert => expert.featured).map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-luna-200 dark:bg-luna-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-luna-500 dark:text-luna-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-luna-800 dark:text-luna-200">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-luna-600 dark:text-luna-400">{expert.title}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-luna-500 dark:text-luna-400">{expert.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs font-medium">
                        {expert.specialization}
                      </span>
                    </div>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                      {expert.bio}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <span>{expert.credentials}</span>
                      <span>{expert.experience}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-luna-700 dark:text-luna-300 mb-2">Key Insights:</h4>
                      <div className="space-y-1">
                        {expert.insights.map((insight, insightIndex) => (
                          <div key={insightIndex} className="flex items-start space-x-2">
                            <Lightbulb className="w-3 h-3 text-luna-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-luna-600 dark:text-luna-400">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                        View Profile
                      </button>
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Experts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">All Experts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-luna-200 dark:bg-luna-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-luna-500 dark:text-luna-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-luna-800 dark:text-luna-200">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-luna-600 dark:text-luna-400">{expert.title}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-luna-500 dark:text-luna-400">{expert.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs font-medium">
                        {expert.specialization}
                      </span>
                    </div>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                      {expert.bio}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <span>{expert.credentials}</span>
                      <span>{expert.experience}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                        View Profile
                      </button>
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Expert Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Expert Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <span>{article.author}</span>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-luna-500 dark:text-luna-400">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <button className="px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                        Read Article
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Get Expert Guidance</h3>
              <p className="text-lg opacity-90 mb-6">
                Connect with licensed mental health professionals for personalized advice and support on your wellness journey.
              </p>
              <button className="px-6 py-3 bg-white text-luna-500 rounded-lg hover:bg-luna-50 transition duration-300 font-medium">
                Schedule Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpertAdvice; 