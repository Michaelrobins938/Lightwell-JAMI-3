import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Shield, 
  Heart, 
  Users, 
  Clock, 
  Star,
  FileText,
  Download,
  ExternalLink,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { comprehensiveContentData } from '../../../data/comprehensiveEducationalContent';

const CrisisResources: React.FC = () => {
  const crisisContent = comprehensiveContentData.filter(content => 
    content.type === 'crisis-resource'
  );

  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support and suicide prevention',
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-red-500',
      available: '24/7',
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, confidential crisis support via text',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-blue-500',
      available: '24/7',
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate emergency response',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-600',
      available: '24/7',
    },
    {
      name: 'Veterans Crisis Line',
      number: '988 (Press 1)',
      description: 'Specialized support for veterans',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-green-500',
      available: '24/7',
    },
  ];

  const crisisTools = [
    {
      title: 'Safety Planning Tool',
      description: 'Create a personalized safety plan for crisis prevention',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-blue-500',
      features: ['Warning signs', 'Coping strategies', 'Support contacts', 'Emergency plan'],
    },
    {
      title: 'Crisis Intervention Guide',
      description: 'Step-by-step guidance for crisis intervention',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500',
      features: ['Immediate steps', 'Safety assessment', 'Professional help', 'Follow-up care'],
    },
    {
      title: 'Support Network Builder',
      description: 'Build your support network for crisis situations',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
      features: ['Contact list', 'Trusted individuals', 'Professional contacts', 'Emergency contacts'],
    },
    {
      title: 'Coping Strategy Library',
      description: 'Immediate coping strategies for crisis moments',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-purple-500',
      features: ['Grounding techniques', 'Breathing exercises', 'Distraction methods', 'Self-soothing'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Emergency Contacts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <span>Emergency Crisis Support</span>
        </h2>
        <p className="text-luna-600 dark:text-luna-400 mb-6">
          Immediate help is available 24/7. If you're in crisis, these resources provide confidential support and intervention.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyContacts.map((contact, index) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg p-6 shadow-lg border border-luna-200 dark:border-luna-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg text-white ${contact.color}`}>
                  {contact.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-luna-800 dark:text-luna-200">
                    {contact.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">{contact.available}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-2">
                  {contact.number}
                </div>
                <p className="text-sm text-luna-600 dark:text-luna-400">
                  {contact.description}
                </p>
              </div>

              <button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 font-medium flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Crisis Tools */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Crisis Prevention Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crisisTools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg p-6 shadow-lg border border-luna-200 dark:border-luna-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg text-white ${tool.color}`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-luna-800 dark:text-luna-200 line-clamp-2">
                    {tool.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                {tool.description}
              </p>

              <div className="space-y-2 mb-4">
                {tool.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="text-xs text-luna-600 dark:text-luna-400">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                Access Tool
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Crisis Support Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crisisContent.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden border border-luna-200 dark:border-luna-600"
            >
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  {content.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <span className="text-sm text-luna-500 dark:text-luna-400">
                    Crisis Resource
                  </span>
                </div>

                <h4 className="font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                  {content.title}
                </h4>
                <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                  {content.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-luna-500 dark:text-luna-400">
                    {content.author}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-luna-400" />
                    <span className="text-sm text-luna-500 dark:text-luna-400">
                      {content.readTime} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 text-sm font-medium">
                    Read Resource
                  </button>
                  {content.downloadable && (
                    <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Crisis Guidelines */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>Important Crisis Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-600 dark:text-red-400">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>If you're in immediate danger, call 911 or go to the nearest emergency room</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>National Suicide Prevention Lifeline: 988 (24/7)</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Crisis Text Line: Text HOME to 741741</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>All crisis support is confidential and free</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Professional help is available 24/7</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>You don't have to face this alone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Statistics */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Crisis Support Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Available Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm opacity-90">Confidential</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">Free</div>
            <div className="text-sm opacity-90">Crisis Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">Immediate</div>
            <div className="text-sm opacity-90">Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisResources; 