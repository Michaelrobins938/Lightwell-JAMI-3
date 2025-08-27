'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  FileText,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import NavigationGuard from '../navigation/NavigationGuard';

interface ServiceWaiverProps {
  onWaiverSigned: (signatureData: any) => void;
  onClose: () => void;
}

export const ServiceWaiver: React.FC<ServiceWaiverProps> = ({
  onWaiverSigned,
  onClose
}) => {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasReadSafety, setHasReadSafety] = useState(false);
  const [hasReadDataUse, setHasReadDataUse] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignatureSubmit = () => {
    if (!signature.trim() || !fullName.trim() || !email.trim() || !dateOfBirth) {
      alert('Please complete all required fields and provide your signature.');
      return;
    }

    setIsSubmitting(true);

    const waiverData = {
      fullName,
      email,
      dateOfBirth,
      emergencyContact,
      emergencyPhone,
      signature,
      signedAt: new Date().toISOString(),
      ipAddress: 'captured-on-submission',
      userAgent: navigator.userAgent,
      termsAccepted: {
        termsOfService: hasReadTerms,
        privacyPolicy: hasReadPrivacy,
        safetyProtocols: hasReadSafety,
        dataUsage: hasReadDataUse
      }
    };

    // Simulate processing time for better UX
    setTimeout(() => {
      onWaiverSigned(waiverData);
      setIsSubmitting(false);
    }, 1000);
  };

  const allTermsAccepted = hasReadTerms && hasReadPrivacy && hasReadSafety && hasReadDataUse;

  return (
    <NavigationGuard
      isActive={hasReadTerms || hasReadPrivacy || hasReadSafety || hasReadDataUse}
      message="Are you sure you want to leave? Your waiver progress will be lost."
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl mx-4 sm:mx-0"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Legal Service Waiver</h1>
                <p className="text-red-100">Required for Service Access</p>
              </div>
            </div>
                         <button
               onClick={onClose}
               className="p-2 hover:bg-red-600/50 rounded-xl transition-colors"
               aria-label="Close waiver modal"
               title="Close waiver modal"
             >
               <span aria-hidden="true">✕</span>
             </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Important Notice */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-800">Important Notice</h2>
            </div>
            <p className="text-red-700 mb-4">
              This waiver is a legally binding document that outlines the terms of service, 
              privacy policies, and safety protocols for using our mental health AI service. 
              Please read carefully before proceeding.
            </p>
            <div className="text-sm text-red-600">
              <p>• This is not a substitute for professional medical care</p>
              <p>• We may escalate to emergency services if safety concerns arise</p>
              <p>• Your data is protected under strict privacy protocols</p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-4">
            {/* Terms of Service */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={hasReadTerms}
                  onChange={(e) => setHasReadTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  aria-describedby="terms-description"
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm font-medium text-gray-900 cursor-pointer">
                    I have read and agree to the Terms of Service
                  </label>
                  <p id="terms-description" className="text-xs text-gray-600 mt-1">
                    Including service limitations, user responsibilities, and company policies
                  </p>
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-red-600 hover:text-red-700 underline mt-1 inline-block"
                  >
                    Read full Terms of Service →
                  </a>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={hasReadPrivacy}
                  onChange={(e) => setHasReadPrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="text-sm font-medium text-gray-900 cursor-pointer">
                    I have read and agree to the Privacy Policy
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Understanding how your data is collected, stored, and protected
                  </p>
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-red-600 hover:text-red-700 underline mt-1 inline-block"
                  >
                    Read full Privacy Policy →
                  </a>
                </div>
              </div>
            </div>

            {/* Safety Protocols */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="safety"
                  checked={hasReadSafety}
                  onChange={(e) => setHasReadSafety(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <div className="flex-1">
                  <label htmlFor="safety" className="text-sm font-medium text-gray-900 cursor-pointer">
                    I understand the Safety Protocols and Crisis Intervention Procedures
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Including automatic escalation to emergency services when necessary
                  </p>
                  <a 
                    href="/safety" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-red-600 hover:text-red-700 underline mt-1 inline-block"
                  >
                    Read full Safety Protocols →
                  </a>
                </div>
              </div>
            </div>

            {/* Data Usage */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="dataUse"
                  checked={hasReadDataUse}
                  onChange={(e) => setHasReadDataUse(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <div className="flex-1">
                  <label htmlFor="dataUse" className="text-sm font-medium text-gray-900 cursor-pointer">
                    I consent to data usage for personalized wellness and service improvement
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Understanding that data is used solely for service enhancement and safety
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          {allTermsAccepted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Legal Name *
                  </label>
                                   <input
                   type="text"
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                   placeholder="Enter your full legal name"
                   required
                   aria-describedby="fullName-help"
                   aria-required="true"
                 />
                 <p id="fullName-help" className="text-xs text-gray-500 mt-1">
                   Enter your full legal name as it appears on official documents
                 </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Name of emergency contact"
                  />
                </div>
                
                                 <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Phone number for emergency contact"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Digital Signature */}
          {allTermsAccepted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Digital Signature
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type your full legal name to sign *
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg font-medium"
                  placeholder="Type your full legal name here"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  By typing your name, you acknowledge this as your digital signature
                </p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          {allTermsAccepted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
                             <button
                 onClick={handleSignatureSubmit}
                 disabled={!signature.trim() || !fullName.trim() || !email.trim() || !dateOfBirth || isSubmitting}
                 className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
               >
                 {isSubmitting ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     Processing...
                   </>
                 ) : (
                   <>
                     <CheckCircle className="w-5 h-5" />
                     Sign Waiver & Continue
                     <ArrowRight className="w-5 h-5" />
                   </>
                 )}
               </button>
            </motion.div>
          )}

          {/* Legal Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Legal Disclaimer</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              This waiver constitutes a legally binding agreement between you and our service. 
              By signing, you acknowledge that you have read, understood, and agree to all terms 
              and conditions. This service is not a substitute for professional medical care, 
              and we reserve the right to escalate to emergency services when safety concerns arise. 
              Your signature indicates informed consent and understanding of these terms.
            </p>
          </div>
                 </div>
       </motion.div>
     </div>
     </NavigationGuard>
   );
 };

export default ServiceWaiver;
