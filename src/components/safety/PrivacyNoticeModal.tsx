'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  X,
  ExternalLink,
  Download,
  Settings
} from 'lucide-react';
import { privacyTransparencyService, PrivacyNotice } from '../../services/privacyTransparencyService';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (noticeId: string) => void;
  userId: string;
  noticeType: 'onboarding' | 'periodic' | 'data_use' | 'crisis' | 'deletion';
  required?: boolean;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
  onAcknowledge,
  userId,
  noticeType,
  required = false
}) => {
  const [notice, setNotice] = useState<PrivacyNotice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRead, setHasRead] = useState(false);
  const [showDataUseDetails, setShowDataUseDetails] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadPrivacyNotice();
    }
  }, [isOpen, userId, noticeType]);

  const loadPrivacyNotice = async () => {
    try {
      setIsLoading(true);
      const privacyNotice = await privacyTransparencyService.getPrivacyNotice(userId, noticeType);
      setNotice(privacyNotice);
    } catch (error) {
      console.error('Error loading privacy notice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = () => {
    if (notice) {
      onAcknowledge(notice.id);
      onClose();
    }
  };

  const getNoticeTitle = () => {
    switch (noticeType) {
      case 'onboarding':
        return 'Privacy and Data Use Information';
      case 'periodic':
        return 'Privacy Policy Reminder';
      case 'data_use':
        return 'How Your Data is Used';
      case 'crisis':
        return 'Crisis Data Handling';
      case 'deletion':
        return 'Your Data Rights';
      default:
        return 'Privacy Notice';
    }
  };

  const getNoticeIcon = () => {
    switch (noticeType) {
      case 'onboarding':
        return <Shield className="w-8 h-8 text-blue-500" />;
      case 'periodic':
        return <Eye className="w-8 h-8 text-green-500" />;
      case 'data_use':
        return <Settings className="w-8 h-8 text-purple-500" />;
      case 'crisis':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'deletion':
        return <Download className="w-8 h-8 text-orange-500" />;
      default:
        return <Lock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getDataUseDetails = () => {
    const disclosure = privacyTransparencyService.getDataUseDisclosure();
    return disclosure;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getNoticeIcon()}
                <div>
                  <h2 className="text-2xl font-bold">{getNoticeTitle()}</h2>
                  <p className="text-blue-100">
                    {required ? 'Required to continue' : 'Important information'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                disabled={required}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notice ? (
              <div className="space-y-6">
                {/* Notice Content */}
                <div className="prose prose-gray max-w-none">
                  <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-gray-700 leading-relaxed">{notice.content}</p>
                  </div>
                </div>

                {/* Data Use Details */}
                <div className="border border-gray-200 rounded-xl">
                  <button
                    onClick={() => setShowDataUseDetails(!showDataUseDetails)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">View Detailed Data Use Information</span>
                    <motion.div
                      animate={{ rotate: showDataUseDetails ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showDataUseDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-gray-200 space-y-4">
                          <DataUseDetails />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Key Points */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Key Points:</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>This chat is not therapy-confidential</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Your data helps improve safety and quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>You can request data deletion at any time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>We never share your data without consent (except for safety)</span>
                    </li>
                  </ul>
                </div>

                {/* Privacy Policy Link */}
                <div className="text-center">
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read Full Privacy Policy
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">Unable to load privacy notice. Please try again.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {required ? (
                  <span className="text-red-600 font-medium">This notice must be acknowledged to continue</span>
                ) : (
                  <span>You can close this notice and review it later</span>
                )}
              </div>
              
              <div className="flex gap-3">
                {!required && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                )}
                
                <button
                  onClick={handleAcknowledge}
                  disabled={!hasRead}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    hasRead
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {required ? 'I Acknowledge & Continue' : 'I Understand'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Data Use Details Component
const DataUseDetails: React.FC = () => {
  const disclosure = privacyTransparencyService.getDataUseDisclosure();
  
  return (
    <div className="space-y-4">
      {/* Data Types */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-2">Data We Collect:</h5>
        <ul className="space-y-1 text-sm text-gray-600">
          {disclosure.dataTypes.map((type, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>{type}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Purposes */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-2">How We Use Your Data:</h5>
        <ul className="space-y-1 text-sm text-gray-600">
          {disclosure.purposes.map((purpose, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>{purpose}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Retention */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-2">Data Retention:</h5>
        <p className="text-sm text-gray-600">{disclosure.retentionPeriod}</p>
      </div>

      {/* User Rights */}
      <div>
        <h5 className="font-semibold text-gray-800 mb-2">Your Rights:</h5>
        <ul className="space-y-1 text-sm text-gray-600">
          {disclosure.userRights.map((right, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>{right}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h5 className="font-semibold text-gray-800 mb-2">Questions About Privacy?</h5>
        <p className="text-sm text-gray-600">
          Contact us at: <a href={`mailto:${disclosure.contactInfo}`} className="text-blue-600 hover:underline">{disclosure.contactInfo}</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyNoticeModal;
