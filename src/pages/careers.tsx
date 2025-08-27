import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const JobCard = ({ 
  title, 
  department, 
  location, 
  type, 
  salary, 
  description, 
  requirements,
  href,
  delay 
}: {
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
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
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-luna-300 transition-colors">
            {title}
          </h3>
          <p className="text-luna-400 text-sm mb-2">{department}</p>
        </div>
        <ExternalLink className="w-5 h-5 text-luna-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-luna-400 mb-4">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{type}</span>
        </div>
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4" />
          <span>{salary}</span>
        </div>
      </div>
      
      <p className="text-luna-300 leading-relaxed mb-4">
        {description}
      </p>
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-luna-200 mb-2">Key Requirements:</h4>
        <div className="space-y-1">
          {requirements.slice(0, 3).map((req, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-luna-400">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-luna-400 group-hover:text-luna-300 transition-colors">
        <span className="text-sm font-medium">Apply Now</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  </motion.div>
);

const CultureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
    }}
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-luna-300 leading-relaxed">{description}</p>
  </motion.div>
);

export default function Careers() {
  const jobListings = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120K - $180K",
      description: "Lead the development of advanced AI models for mental health support, working on cutting-edge natural language processing and emotional intelligence systems.",
      requirements: [
        "5+ years experience in AI/ML",
        "Expertise in Python, TensorFlow/PyTorch",
        "Experience with NLP and sentiment analysis"
      ],
      href: "#senior-ai-engineer"
    },
    {
      title: "Mental Health Specialist",
      department: "Clinical",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$80K - $120K",
      description: "Provide clinical expertise to ensure Luna AI delivers safe, effective, and evidence-based mental health support to users worldwide.",
      requirements: [
        "Licensed mental health professional",
        "Experience with digital mental health",
        "Knowledge of evidence-based therapies"
      ],
      href: "#mental-health-specialist"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      salary: "$100K - $150K",
      description: "Drive product strategy and development for Luna AI, ensuring we deliver exceptional user experiences and meaningful mental health outcomes.",
      requirements: [
        "3+ years product management experience",
        "Experience with AI/healthcare products",
        "Strong analytical and communication skills"
      ],
      href: "#product-manager"
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$90K - $140K",
      description: "Build beautiful, accessible user interfaces for Luna AI, creating seamless experiences that make mental health support more accessible.",
      requirements: [
        "3+ years React/TypeScript experience",
        "Experience with accessibility standards",
        "Passion for mental health technology"
      ],
      href: "#frontend-developer"
    },
    {
      title: "Data Scientist",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      salary: "$110K - $160K",
      description: "Analyze user data to improve Luna AI's effectiveness, develop insights that drive product decisions and enhance mental health outcomes.",
      requirements: [
        "Advanced degree in Statistics/Data Science",
        "Experience with healthcare data",
        "Strong Python and SQL skills"
      ],
      href: "#data-scientist"
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      salary: "$85K - $130K",
      description: "Design intuitive, empathetic user experiences for Luna AI, ensuring our platform is accessible and supportive for users in crisis.",
      requirements: [
        "5+ years UX design experience",
        "Experience with mental health products",
        "Strong user research skills"
      ],
      href: "#ux-designer"
    }
  ];

  const cultureValues = [
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Compassion First",
      description: "Every decision we make is guided by empathy and a deep commitment to improving mental health outcomes."
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Innovation Driven",
      description: "We push the boundaries of AI technology to create solutions that truly make a difference in people's lives."
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Collaborative Growth",
      description: "We believe in the power of diverse perspectives and foster an environment where everyone can thrive and grow."
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Global Impact",
      description: "Our mission is to make mental health support accessible to everyone, everywhere, regardless of background or circumstance."
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Comprehensive health coverage",
    "Flexible remote work policy",
    "Professional development budget",
    "Mental health days and support",
    "Generous PTO and holidays",
    "401(k) with company match",
    "Home office stipend"
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
              Careers
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-luna-200 mb-8 max-w-3xl mx-auto">
              Help us revolutionize mental health support through AI. Join a team that's passionate about 
              making a real difference in people's lives.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link href="#open-positions">
                <button className="bg-gradient-to-r from-luna-500 to-luna-600 hover:from-luna-600 hover:to-luna-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  View Open Positions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Culture Section */}
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
              Our Culture
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              We're building more than a company - we're building a movement to make mental health support accessible to everyone.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <CultureCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Benefits & Perks
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              We take care of our team so you can focus on making a difference
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-center space-x-3 p-4 rounded-xl bg-luna-800/40 border border-luna-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-luna-200">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20" id="open-positions">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Join our team and help us build the future of mental health support
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobListings.map((job, index) => (
              <JobCard
                key={job.title}
                title={job.title}
                department={job.department}
                location={job.location}
                type={job.type}
                salary={job.salary}
                description={job.description}
                requirements={job.requirements}
                href={job.href}
                delay={index * 0.1}
              />
            ))}
          </div>
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
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-luna-100 mb-8 max-w-2xl mx-auto">
              Join our mission to revolutionize mental health support through AI. 
              Every role at Luna AI contributes to helping people in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#open-positions">
                <button className="bg-white text-luna-600 hover:bg-luna-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  View All Positions
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