import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function Press() {
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
              Press
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Press & Media
            </h1>
            <p className="text-xl md:text-2xl text-luna-200 mb-8 max-w-3xl mx-auto">
              Press releases, media resources, and contact information for journalists 
              covering Luna AI and the future of mental health technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
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
              Latest Press Releases
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Stay updated with our latest announcements and company news
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Luna AI Raises $50M Series B to Expand Mental Health Support Globally",
                date: "March 15, 2024",
                excerpt: "Funding will accelerate development of advanced AI models and expand access to mental health support in underserved communities worldwide.",
                href: "#press-release-1"
              },
              {
                title: "Luna AI Partners with Major Healthcare Systems",
                date: "March 10, 2024",
                excerpt: "Strategic partnerships will integrate Luna AI into clinical workflows, providing AI-powered support alongside traditional mental health services.",
                href: "#press-release-2"
              },
              {
                title: "Luna AI Achieves HIPAA Compliance Certification",
                date: "March 5, 2024",
                excerpt: "Certification ensures Luna AI meets the highest standards for patient privacy and data security in mental health applications.",
                href: "#press-release-3"
              }
            ].map((release, index) => (
              <motion.div
                key={release.title}
                className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300 group"
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
                <Link href={release.href} className="block">
                  <div className="flex items-center space-x-2 text-sm text-luna-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{release.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-luna-300 transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-luna-300 leading-relaxed mb-4">
                    {release.excerpt}
                  </p>
                  <div className="flex items-center space-x-2 text-luna-400 group-hover:text-luna-300 transition-colors">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
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
              Media Kit
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Download logos, images, and company information for your coverage
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <ImageIcon className="w-6 h-6 text-white" />,
                title: "Logos & Brand Assets",
                description: "High-resolution logos and brand guidelines",
                href: "#logos"
              },
              {
                icon: <FileText className="w-6 h-6 text-white" />,
                title: "Company Fact Sheet",
                description: "Key facts and statistics about Luna AI",
                href: "#fact-sheet"
              },
              {
                icon: <Video className="w-6 h-6 text-white" />,
                title: "Product Screenshots",
                description: "High-quality screenshots and demos",
                href: "#screenshots"
              },
              {
                icon: <Globe className="w-6 h-6 text-white" />,
                title: "Press Kit PDF",
                description: "Complete press kit in PDF format",
                href: "#press-kit"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300 group"
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
                <Link href={item.href} className="block">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-luna-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-luna-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2 text-luna-400 group-hover:text-luna-300 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
              Media Contact
            </h2>
            <p className="text-xl text-luna-200 mb-8 max-w-2xl mx-auto">
              For press inquiries, interviews, or additional information, please contact our media team.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: <Mail className="w-6 h-6 text-white" />,
                  title: "Email",
                  contact: "press@luna-ai.com",
                  description: "For press releases and media inquiries"
                },
                {
                  icon: <Phone className="w-6 h-6 text-white" />,
                  title: "Phone",
                  contact: "+1 (555) 123-4567",
                  description: "For urgent media requests"
                },
                {
                  icon: <Calendar className="w-6 h-6 text-white" />,
                  title: "Response Time",
                  contact: "Within 24 hours",
                  description: "We respond to all media inquiries promptly"
                }
              ].map((contact, index) => (
                <motion.div
                  key={contact.title}
                  className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center mb-4">
                    {contact.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{contact.title}</h3>
                  <p className="text-luna-300 font-medium mb-2">{contact.contact}</p>
                  <p className="text-luna-400 text-sm">{contact.description}</p>
                </motion.div>
              ))}
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
              Need More Information?
            </h2>
            <p className="text-xl text-luna-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our media team is here to help with any additional resources or information you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-luna-600 hover:bg-luna-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Contact Media Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="#media-kit">
                <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg transition-all duration-300">
                  Download Media Kit
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 