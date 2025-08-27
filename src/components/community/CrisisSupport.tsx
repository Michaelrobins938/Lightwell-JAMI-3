import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MessageCircle, Heart, Shield, Clock,
  Users, Star, TrendingUp, BookOpen, ExternalLink, Plus,
  HelpCircle, Info, CheckCircle, X, ChevronDown, ChevronUp
} from 'lucide-react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  image: string;
  isExpert?: boolean;
  isModerator?: boolean;
  joinDate: string;
  postCount: number;
  helpfulCount: number;
  reputation?: number;
  badges?: string[];
}

interface CrisisResource {
  id: string;
  title: string;
  description: string;
  phone?: string;
  url?: string;
  type: 'hotline' | 'crisis-chat' | 'emergency' | 'support-group' | 'resource';
  available: '24/7' | 'business-hours' | 'limited';
  region?: string;
  languages?: string[];
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
}

interface CrisisSupportProps {
  user: User | null;
}

export const CrisisSupport: React.FC<CrisisSupportProps> = ({ user }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);

  const crisisResources: CrisisResource[] = [
    {
      id: '1',
      title: 'National Suicide Prevention Lifeline',
      description: 'Free, confidential support for people in distress, prevention and crisis resources.',
      phone: '988',
      type: 'hotline',
      available: '24/7',
      region: 'United States',
      languages: ['English', 'Spanish'],
      isVerified: true,
      rating: 4.9,
      reviewCount: 1250
    },
    {
      id: '2',
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 to connect with a Crisis Counselor. Free, 24/7 support.',
      phone: '741741',
      type: 'crisis-chat',
      available: '24/7',
      region: 'United States',
      languages: ['English'],
      isVerified: true,
      rating: 4.8,
      reviewCount: 890
    },
    {
      id: '3',
      title: 'Emergency Services',
      description: 'If you are in immediate danger, call emergency services immediately.',
      phone: '911',
      type: 'emergency',
      available: '24/7',
      region: 'United States',
      languages: ['English'],
      isVerified: true
    },
    {
      id: '4',
      title: 'The Trevor Project',
      description: 'Crisis intervention and suicide prevention services for LGBTQ+ youth.',
      phone: '1-866-488-7386',
      type: 'hotline',
      available: '24/7',
      region: 'United States',
      languages: ['English'],
      isVerified: true,
      rating: 4.7,
      reviewCount: 456
    },
    {
      id: '5',
      title: 'Veterans Crisis Line',
      description: 'Confidential support for veterans and their families.',
      phone: '1-800-273-8255',
      type: 'hotline',
      available: '24/7',
      region: 'United States',
      languages: ['English'],
      isVerified: true,
      rating: 4.6,
      reviewCount: 234
    },
    {
      id: '6',
      title: 'Crisis Support Community',
      description: 'Connect with others who understand what you\'re going through.',
      url: '/community/crisis-support',
      type: 'support-group',
      available: '24/7',
      region: 'Global',
      languages: ['English'],
      isVerified: true,
      rating: 4.5,
      reviewCount: 123
    }
  ];

  const types = [
    { id: 'all', label: 'All Resources', icon: HelpCircle, color: 'text-red-400' },
    { id: 'hotline', label: 'Hotlines', icon: Phone, color: 'text-green-400' },
    { id: 'crisis-chat', label: 'Crisis Chat', icon: MessageCircle, color: 'text-blue-400' },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'support-group', label: 'Support Groups', icon: Users, color: 'text-purple-400' },
    { id: 'resource', label: 'Resources', icon: BookOpen, color: 'text-yellow-400' },
  ];

  const filteredResources = crisisResources.filter(resource => {
    return selectedType === 'all' || resource.type === selectedType;
  });

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleText = (phone: string) => {
    // For SMS, you would typically use a different approach
    console.log('Texting:', phone);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Warning */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/50 backdrop-blur-xl rounded-lg p-6 border border-red-500/20 shadow-lg"
      >
        <div className="flex items-start space-x-4">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-red-200 mb-2">
              If you're in immediate crisis or danger:
            </h3>
            <div className="space-y-2 text-red-100">
              <p>• Call <strong>911</strong> for emergency services</p>
              <p>• Call <strong>988</strong> for the National Suicide Prevention Lifeline</p>
              <p>• Text <strong>HOME</strong> to <strong>741741</strong> for Crisis Text Line</p>
            </div>
            <button
              onClick={() => setShowEmergencyInfo(!showEmergencyInfo)}
              className="mt-3 text-sm text-red-300 hover:text-red-200 underline"
            >
              {showEmergencyInfo ? 'Hide' : 'Show'} more emergency information
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showEmergencyInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-red-500/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-100">
                <div>
                  <h4 className="font-semibold mb-2">Signs of Crisis:</h4>
                  <ul className="space-y-1">
                    <li>• Thoughts of harming yourself or others</li>
                    <li>• Feeling hopeless or trapped</li>
                    <li>• Extreme emotional distress</li>
                    <li>• Sudden changes in behavior</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What to do:</h4>
                  <ul className="space-y-1">
                    <li>• Call emergency services immediately</li>
                    <li>• Stay with the person if safe</li>
                    <li>• Remove access to harmful items</li>
                    <li>• Contact a mental health professional</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Shield className="mr-2 text-red-400" size={24} />
            Crisis Support
          </h2>
          <p className="text-zinc-400">
            Immediate help and support resources for crisis situations
          </p>
        </div>
      </div>

      {/* Resource Type Filter */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 border border-white/10">
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedType === type.id
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              <type.icon size={16} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <CrisisResourceCard
            key={resource.id}
            resource={resource}
            onCall={handleCall}
            onText={handleText}
            index={index}
          />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-zinc-400"
        >
          <Shield size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No crisis resources found.</p>
          <p className="text-sm">Please contact emergency services if you need immediate help.</p>
        </motion.div>
      )}

      {/* Additional Support */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Support Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-zinc-200">Professional Help</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>• Find a therapist or counselor</li>
              <li>• Contact your primary care doctor</li>
              <li>• Reach out to a mental health professional</li>
              <li>• Consider inpatient treatment if needed</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-zinc-200">Self-Care Strategies</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>• Practice deep breathing exercises</li>
              <li>• Use grounding techniques</li>
              <li>• Reach out to trusted friends/family</li>
              <li>• Remove yourself from harmful situations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-yellow-900/50 backdrop-blur-xl rounded-lg p-6 border border-yellow-500/20">
        <div className="flex items-start space-x-4">
          <Info className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-yellow-200 mb-2">
              Important Safety Information
            </h3>
            <p className="text-yellow-100 text-sm">
              This information is provided for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
              If you are experiencing a medical emergency, call 911 immediately. Always seek the advice of qualified health providers with questions about your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CrisisResourceCard: React.FC<{
  resource: CrisisResource;
  onCall: (phone: string) => void;
  onText: (phone: string) => void;
  index: number;
}> = ({ resource, onCall, onText, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotline':
        return Phone;
      case 'crisis-chat':
        return MessageCircle;
      case 'emergency':
        return AlertTriangle;
      case 'support-group':
        return Users;
      case 'resource':
        return BookOpen;
      default:
        return HelpCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotline':
        return 'text-green-400';
      case 'crisis-chat':
        return 'text-blue-400';
      case 'emergency':
        return 'text-red-500';
      case 'support-group':
        return 'text-purple-400';
      case 'resource':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const TypeIcon = getTypeIcon(resource.type);
  const typeColor = getTypeColor(resource.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-white/10 hover:border-red-500/30 transition-all duration-300"
    >
      {/* Resource Header */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center`}>
              <TypeIcon className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300 capitalize`}>
                  {resource.type.replace('-', ' ')}
                </span>
                {resource.isVerified && (
                  <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    Verified
                  </span>
                )}
                <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">
                  {resource.available}
                </span>
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">
                {resource.title}
              </h3>
              {resource.rating && (
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-400" />
                  <span className="text-xs text-zinc-400">{resource.rating}</span>
                  <span className="text-xs text-zinc-500">({resource.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Content */}
      <div className="p-6">
        <p className="text-zinc-300 mb-4">
          {resource.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-zinc-400">
          {resource.region && (
            <div className="flex items-center space-x-2">
              <span>Region:</span>
              <span className="text-zinc-300">{resource.region}</span>
            </div>
          )}
          {resource.languages && resource.languages.length > 0 && (
            <div className="flex items-center space-x-2">
              <span>Languages:</span>
              <span className="text-zinc-300">{resource.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {resource.phone && (
            <motion.button
              onClick={() => onCall(resource.phone!)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone size={16} />
              <span>Call {resource.phone}</span>
            </motion.button>
          )}

          {resource.type === 'crisis-chat' && resource.phone && (
            <motion.button
              onClick={() => onText(resource.phone!)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle size={16} />
              <span>Text {resource.phone}</span>
            </motion.button>
          )}

          {resource.url && (
            <button
              onClick={() => window.open(resource.url, '_blank')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-all duration-300"
            >
              <ExternalLink size={16} />
              <span>Visit Website</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-zinc-400 hover:text-zinc-300 transition-all duration-300"
          >
            <span className="text-sm">More Information</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Expanded Information */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-zinc-700"
            >
              <div className="space-y-2 text-sm text-zinc-400">
                <p>
                  <strong className="text-zinc-300">What to expect:</strong> Professional crisis counselors are available to provide immediate support and guidance.
                </p>
                <p>
                  <strong className="text-zinc-300">Confidentiality:</strong> All conversations are confidential, except in cases where there is immediate danger to yourself or others.
                </p>
                <p>
                  <strong className="text-zinc-300">No cost:</strong> These services are free and available to anyone in need.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 