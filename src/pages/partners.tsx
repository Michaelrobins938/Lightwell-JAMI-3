import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
    Users, 
  Globe, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Star,
  ExternalLink,
  Building,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const PartnerCard = ({ 
  name, 
  logo, 
  description, 
  category, 
  href, 
  delay 
}: {
  name: string;
  logo: string;
  description: string;
  category: string;
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
        <div className="w-16 h-16 rounded-xl bg-luna-700/50 flex items-center justify-center">
          <Image src={logo} alt={name} width={40} height={40} className="w-10 h-10 object-contain" />
        </div>
        <ExternalLink className="w-5 h-5 text-luna-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="mb-4">
        <span className="inline-block px-2 py-1 bg-luna-700/50 text-luna-300 text-xs rounded-full mb-2">
          {category}
        </span>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-luna-300 transition-colors">
          {name}
        </h3>
        <p className="text-luna-300 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  </motion.div>
);

const PartnershipType = ({ 
  icon, 
  title, 
  description, 
  benefits, 
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
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
    <p className="text-luna-300 leading-relaxed mb-4">
      {description}
    </p>
    <div className="space-y-2">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm text-luna-400">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function Partners() {
  const currentPartners = [
    {
      name: "Mayo Clinic",
      logo: "/logos/mayo-clinic.png",
      description: "Leading healthcare system integrating Luna AI into clinical workflows for enhanced patient care.",
      category: "Healthcare",
      href: "#mayo-clinic"
    },
    {
      name: "Stanford Health",
      logo: "/logos/stanford-health.png",
      description: "Pioneering research partnership to advance AI-powered mental health interventions.",
      category: "Research",
      href: "#stanford-health"
    },
    {
      name: "Mental Health America",
      logo: "/logos/mha.png",
      description: "National advocacy organization promoting accessible mental health support through technology.",
      category: "Advocacy",
      href: "#mha"
    },
    {
      name: "Crisis Text Line",
      logo: "/logos/crisis-text-line.png",
      description: "24/7 crisis intervention service leveraging Luna AI for immediate support and escalation.",
      category: "Crisis Support",
      href: "#crisis-text-line"
    },
    {
      name: "American Psychological Association",
      logo: "/logos/apa.png",
      description: "Professional organization ensuring ethical AI implementation in mental health practice.",
      category: "Professional",
      href: "#apa"
    },
    {
      name: "National Alliance on Mental Illness",
      logo: "/logos/nami.png",
      description: "Supporting families and individuals affected by mental illness through AI-powered resources.",
      category: "Support",
      href: "#nami"
    }
  ];

  const partnershipTypes = [
    {
      icon: <Building className="w-6 h-6 text-white" />,
      title: "Healthcare Systems",
      description: "Integrate Luna AI into clinical workflows and patient care programs.",
      benefits: [
        "Enhanced patient outcomes",
        "Reduced clinician burnout",
        "Improved access to care",
        "Data-driven insights"
      ]
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Mental Health Organizations",
      description: "Expand your reach and provide 24/7 support to your community.",
      benefits: [
        "Increased service capacity",
        "Crisis intervention support",
        "Community outreach",
        "Evidence-based care"
      ]
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Technology Partners",
      description: "Build innovative solutions that leverage Luna AI's advanced capabilities.",
      benefits: [
        "API access and support",
        "Custom model training",
        "White-label solutions",
        "Technical collaboration"
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Research Institutions",
      description: "Advance the field of AI-powered mental health through collaborative research.",
      benefits: [
        "Research data access",
        "Clinical trial support",
        "Publication opportunities",
        "Academic partnerships"
      ]
    }
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
              Partnerships
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Partner With Us
            </h1>
            <p className="text-xl md:text-2xl text-luna-200 mb-8 max-w-3xl mx-auto">
              Join forces with Luna AI to revolutionize mental health support. Together, 
              we can make a greater impact and reach more people in need.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link href="/contact">
                <button className="bg-gradient-to-r from-luna-500 to-luna-600 hover:from-luna-600 hover:to-luna-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Become a Partner
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Types */}
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
              Partnership Opportunities
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              We offer various partnership models to meet your organization's needs and goals
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnershipTypes.map((type, index) => (
              <PartnershipType
                key={type.title}
                icon={type.icon}
                title={type.title}
                description={type.description}
                benefits={type.benefits}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
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
              Our Partners
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Leading organizations that trust Luna AI to enhance their mental health services
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPartners.map((partner, index) => (
              <PartnerCard
                key={partner.name}
                name={partner.name}
                logo={partner.logo}
                description={partner.description}
                category={partner.category}
                href={partner.href}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
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
              Why Partner With Luna AI?
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Discover the benefits of partnering with us to advance mental health support
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "Cutting-Edge Technology",
                description: "Access to the latest AI advancements in mental health support and emotional intelligence."
              },
              {
                icon: <Target className="w-8 h-8 text-white" />,
                title: "Proven Impact",
                description: "Evidence-based approach with measurable improvements in mental health outcomes."
              },
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: "Security & Compliance",
                description: "HIPAA-compliant platform with enterprise-grade security and privacy protection."
              },
              {
                icon: <Globe className="w-8 h-8 text-white" />,
                title: "Global Reach",
                description: "Extend your services worldwide with our multilingual and culturally adaptive AI."
              },
              {
                icon: <Heart className="w-8 h-8 text-white" />,
                title: "24/7 Support",
                description: "Provide round-the-clock mental health support without increasing staff burden."
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: "Dedicated Support",
                description: "Comprehensive partnership support including training, integration, and ongoing assistance."
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-luna-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
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
              Ready to Partner?
            </h2>
            <p className="text-xl text-luna-100 mb-8 max-w-2xl mx-auto">
              Join our network of partners and help us make mental health support accessible to everyone, everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-luna-600 hover:bg-luna-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Contact Partnership Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="#partnership-guide">
                <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg transition-all duration-300">
                  Download Partnership Guide
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 