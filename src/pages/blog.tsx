import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Star,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const BlogCard = ({ 
  title, 
  excerpt, 
  author, 
  date, 
  readTime, 
  category, 
  image,
  views,
  likes,
  comments,
  href,
  delay 
}: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
  href: string;
  delay: number;
}) => (
  <motion.div
    className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300 group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
    }}
  >
    <Link href={href} className="block">
      <div className="relative mb-4">
        <Image 
          src={image} 
          alt={title}
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-luna-700/80 text-luna-300 text-xs rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-luna-300 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-luna-300 leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-luna-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-luna-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-luna-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  </motion.div>
);

const FeaturedPost = ({ 
  title, 
  excerpt, 
  author, 
  date, 
  readTime, 
  category, 
  image,
  href,
  delay 
}: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  href: string;
  delay: number;
}) => (
  <motion.div
    className="relative p-8 rounded-2xl bg-gradient-to-br from-luna-600/20 to-luna-500/20 backdrop-blur-xl border border-luna-600/50 hover:border-luna-500/30 transition-all duration-300 group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
    }}
  >
    <Link href={href} className="block">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <Image 
            src={image} 
            alt={title}
            width={600}
            height={320}
            className="w-full h-64 lg:h-80 object-cover rounded-xl"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-luna-700/80 text-luna-300 text-sm rounded-full">
              {category}
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
              Featured Post
            </span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-luna-300 transition-colors">
            {title}
          </h2>
          
          <p className="text-luna-200 leading-relaxed text-lg mb-6">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-luna-300 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-luna-300">Read More</span>
            <ArrowRight className="w-4 h-4 text-luna-400" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function Blog() {
  const featuredPost = {
    title: "The Future of AI-Powered Mental Health Support",
    excerpt: "Discover how artificial intelligence is revolutionizing mental health care, making support more accessible, personalized, and effective than ever before. Learn about the latest breakthroughs and what's coming next.",
    author: "Dr. Sarah Chen",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "AI & Mental Health",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    href: "#featured-post"
  };

  const blogPosts = [
    {
      title: "Understanding Emotional Intelligence in AI Systems",
      excerpt: "How Luna AI processes and responds to human emotions with unprecedented accuracy and empathy.",
      author: "Dr. Michael Rodriguez",
      date: "March 12, 2024",
      readTime: "6 min read",
      category: "AI Research",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecadf8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      views: 1247,
      likes: 89,
      comments: 23,
      href: "#emotional-intelligence"
    },
    {
      title: "Building Trust in AI Mental Health Applications",
      excerpt: "The critical importance of transparency, privacy, and ethical considerations in AI-powered mental health support.",
      author: "Emma Thompson",
      date: "March 10, 2024",
      readTime: "5 min read",
      category: "Privacy & Ethics",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      views: 892,
      likes: 67,
      comments: 18,
      href: "#trust-ai"
    },
    {
      title: "The Impact of 24/7 AI Support on Mental Health Outcomes",
      excerpt: "Research findings on how round-the-clock AI companionship improves mental health outcomes and reduces crisis situations.",
      author: "Dr. James Wilson",
      date: "March 8, 2024",
      readTime: "7 min read",
      category: "Research",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      views: 1563,
      likes: 124,
      comments: 31,
      href: "#24-7-support"
    },
    {
      title: "Luna AI: Behind the Scenes of Our Latest Update",
      excerpt: "An inside look at the new features, improvements, and technical innovations in Luna AI's latest release.",
      author: "Alex Chen",
      date: "March 5, 2024",
      readTime: "4 min read",
      category: "Product Updates",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      views: 2103,
      likes: 156,
      comments: 42,
      href: "#luna-update"
    },
    {
      title: "Crisis Detection: How AI Saves Lives",
      excerpt: "The sophisticated algorithms that enable Luna AI to detect crisis situations and provide immediate intervention.",
      author: "Dr. Lisa Park",
      date: "March 3, 2024",
      readTime: "9 min read",
      category: "Crisis Intervention",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      views: 1876,
      likes: 143,
      comments: 28,
      href: "#crisis-detection"
    },
    {
      title: "The Psychology of AI Companionship",
      excerpt: "Understanding how humans form meaningful relationships with AI systems and the therapeutic benefits of these connections.",
      author: "Dr. Robert Kim",
      date: "March 1, 2024",
      readTime: "6 min read",
      category: "Psychology",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      views: 1342,
      likes: 98,
      comments: 25,
      href: "#ai-companionship"
    }
  ];

  const categories = [
    "All Posts",
    "AI Research",
    "Mental Health",
    "Product Updates",
    "Privacy & Ethics",
    "Crisis Intervention",
    "Psychology",
    "User Stories"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-luna-900 via-luna-800 to-luna-700">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luna-600/10 to-luna-500/10"></div>
        <div className="relative container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 mb-6 bg-luna-800/50 border border-luna-600/50 text-luna-300 rounded-full text-xs font-medium">
              Blog
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Luna AI Blog
            </h1>
            <p className="text-xl md:text-2xl text-luna-200 mb-8 max-w-3xl mx-auto">
              Insights, updates, and stories from the forefront of AI-powered mental health support. 
              Stay informed about the latest developments in AI, mental health, and Luna AI.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luna-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 bg-luna-800/50 border border-luna-700/50 rounded-xl text-white placeholder-luna-400 focus:outline-none focus:border-luna-500/50 focus:ring-2 focus:ring-luna-500/20"
                />
              </div>
              <button className="px-6 py-3 bg-luna-700/50 border border-luna-600/50 text-luna-300 rounded-xl hover:bg-luna-600/50 transition-colors flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0 
                    ? 'bg-luna-600 text-white' 
                    : 'bg-luna-800/50 text-luna-300 hover:bg-luna-700/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Featured Article
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Our most popular and insightful article
            </p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <FeaturedPost
              title={featuredPost.title}
              excerpt={featuredPost.excerpt}
              author={featuredPost.author}
              date={featuredPost.date}
              readTime={featuredPost.readTime}
              category={featuredPost.category}
              image={featuredPost.image}
              href={featuredPost.href}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-luna-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Stay updated with the latest insights and developments
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard
                key={post.title}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                date={post.date}
                readTime={post.readTime}
                category={post.category}
                image={post.image}
                views={post.views}
                likes={post.likes}
                comments={post.comments}
                href={post.href}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="#load-more">
              <button className="px-8 py-4 bg-luna-700/50 border border-luna-600/50 text-luna-300 rounded-xl hover:bg-luna-600/50 transition-colors flex items-center space-x-2 mx-auto">
                <span>Load More Articles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-8">
              Stay Updated
            </h2>
            <p className="text-xl text-luna-200 mb-8 max-w-2xl mx-auto">
              Get the latest articles, updates, and insights delivered to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-luna-800/50 border border-luna-700/50 rounded-xl text-white placeholder-luna-400 focus:outline-none focus:border-luna-500/50 focus:ring-2 focus:ring-luna-500/20"
              />
              <button className="px-8 py-3 bg-luna-600 text-white rounded-xl hover:bg-luna-700 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-luna-600 to-luna-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Join the Conversation
            </h2>
            <p className="text-xl text-luna-100 mb-8 max-w-2xl mx-auto">
              Share your thoughts, ask questions, and connect with our community of AI and mental health enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <button className="bg-white text-luna-600 hover:bg-luna-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Join Community
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg transition-all duration-300">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 