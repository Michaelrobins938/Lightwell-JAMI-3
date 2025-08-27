'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Heart,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Cpu,
  BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = 'January 15, 2025';
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <>
      {/* Emergency Resources - Floating/Sticky */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-900 font-semibold text-sm">Need Help Now?</span>
          </div>
          <div className="space-y-1 text-red-800 text-xs">
            <p><strong>Emergency:</strong> 911</p>
            <p><strong>Crisis Line:</strong> 988</p>
            <p><strong>Text Help:</strong> HOME to 741741</p>
          </div>
        </div>
      </motion.div>

      <div className="min-h-screen relative overflow-hidden">
        {/* JAMI-3 Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#e91e63] via-[#c44cff] via-[#7c3aed] to-[#4a148c] opacity-80"></div>
        <div className="fixed inset-0 bg-gradient-to-tr from-[#ff6b9d]/70 via-[#e91e63]/60 via-[#c2185b]/50 to-[#880e4f]/40 opacity-50 mix-blend-multiply"></div>
        <div className="fixed inset-0 bg-gradient-to-bl from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen"></div>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-700 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to JAMI-3</span>
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-sm font-medium text-white/90">Lightwell Legal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Page Header - Clean, Minimal Design */}
              <div className="text-center py-12 px-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  These terms govern your use of JAMI-3, our AI emotional support platform powered by Lightwell.
                  Please read them carefully before using our services.
                </p>
                <p className="text-gray-500 text-sm mt-4 font-medium">Last updated: {lastUpdated}</p>
              </div>

              {/* Critical Notice - Subtle Alert Styling */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white border-l-4 border-red-500 rounded-r-lg p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-2 text-lg">Important Notice</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      <strong>This service provides AI emotional support and is not a substitute for professional mental health care.</strong>
                      In case of emergency, please contact 911 or your local emergency services immediately.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div><strong className="text-gray-900">Emergency:</strong> 911</div>
                      <div><strong className="text-gray-900">Crisis Line:</strong> 988</div>
                      <div><strong className="text-gray-900">Text Help:</strong> HOME to 741741</div>
                      <div><strong className="text-gray-900">Helpline:</strong> 1-800-662-4357</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Accordion Sections */}
              {[
                {
                  id: 1,
                  title: "Service Description",
                  icon: <Heart className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Our platform provides AI-powered emotional support and wellness tools designed to complement,
                        not replace, professional mental health care. The service includes:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>AI emotional support conversations with JAMI-3</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Wellness assessments and tracking tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Crisis detection and resource provision</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Educational content and coping strategies</span>
                        </li>
                      </ul>
                    </div>
                  )
                },
                {
                  id: 2,
                  title: "Service Limitations & AI Disclaimer",
                  icon: <Cpu className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>This service is NOT:</strong>
                      </p>
                      <ul className="space-y-2 text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>A substitute for professional therapy or medical treatment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>A source of medical diagnosis or treatment recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Emergency mental health care</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>HIPAA-protected communication</span>
                        </li>
                      </ul>

                      <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 mt-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-amber-300 font-semibold mb-2">AI-Specific Disclaimer</h4>
                            <p className="text-amber-200/80 text-sm leading-relaxed">
                              Conversations are generated by AI and may be inaccurate, incomplete, or inappropriate.
                              Always verify information with qualified professionals. JAMI-3's responses are not medical advice.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  id: 3,
                  title: "User Responsibilities",
                  icon: <CheckCircle className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        By using JAMI-3, you agree to:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Provide accurate and truthful information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Seek professional help for serious mental health concerns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Not use the service for harmful or illegal purposes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Respect JAMI-3's boundaries and limitations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Maintain appropriate session frequency and duration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Report any technical issues or safety concerns</span>
                        </li>
                      </ul>
                    </div>
                  )
                },
                {
                  id: 4,
                  title: "Age Requirements & Safety",
                  icon: <Shield className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Minimum Age:</strong> You must be at least 13 years old to use JAMI-3.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Users Under 18:</strong> If you are under 18, you must have parental or guardian consent.
                        We implement additional safety measures and restrictions for users under 18.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Parental Responsibility:</strong> Parents and guardians are responsible for monitoring their child's use
                        of this service and ensuring appropriate supervision.
                      </p>
                      <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                        <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Safety & Crisis Protocols
                        </h4>
                        <p className="text-green-200/80 text-sm leading-relaxed">
                          Our platform includes automated crisis detection, real-time intervention, and automatic escalation to emergency services when necessary.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 5,
                  title: "Privacy & Data Protection",
                  icon: <Shield className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Your privacy is important to us. Please review our{' '}
                        <Link href="/privacy" className="text-white hover:text-gray-700 underline font-medium">
                          Privacy Policy
                        </Link>{' '}
                        for detailed information about how we collect, use, and protect your data.
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Conversations are stored for safety and quality improvement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Data is encrypted and protected with industry-standard security</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>You can request data deletion at any time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>This is not HIPAA-protected communication</span>
                        </li>
                      </ul>
                    </div>
                  )
                },
                {
                  id: 6,
                  title: "Prohibited Uses & Termination",
                  icon: <AlertTriangle className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        You may not use JAMI-3 to:
                      </p>
                      <ul className="space-y-2 text-gray-600 mb-6">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Harm yourself or others</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Engage in illegal activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Harass, abuse, or threaten others</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Attempt to manipulate or exploit the AI system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Share harmful or inappropriate content</span>
                        </li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Termination:</strong> We may terminate or suspend your access at any time for conduct that violates these terms.
                        You may stop using JAMI-3 at any time.
                      </p>
                    </div>
                  )
                },
                {
                  id: 7,
                  title: "Legal Disclaimers & Jurisdiction",
                  icon: <FileText className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>No Warranty:</strong> JAMI-3 is provided "as is" without warranties of any kind.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Limitation of Liability:</strong> Lightwell is not liable for any damages arising from your use of JAMI-3,
                        including emotional distress or mental health issues.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Professional Advice:</strong> Always consult qualified mental health professionals for diagnosis and treatment.
                        JAMI-3 is not a substitute for professional care.
                      </p>
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                        <h4 className="text-blue-300 font-semibold mb-2">Jurisdiction</h4>
                        <p className="text-blue-200/80 text-sm leading-relaxed">
                          These Terms are governed by the laws of the State of Delaware, United States.
                          Any disputes shall be resolved in the courts of Delaware.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 8,
                  title: "Updates & Contact",
                  icon: <Clock className="w-5 h-5" />,
                  content: (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Changes to Terms:</strong> We may update these terms from time to time.
                        <span className="text-amber-300 font-medium"> Material changes will be notified via email and app notifications.</span>
                        Your continued use constitutes acceptance of new terms.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        The date of the most recent update is shown at the top of this document.
                      </p>

                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-6">
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-gray-600">
                          <p><strong>Email:</strong> legal@lightwell.com</p>
                          <p><strong>Support:</strong> support@lightwell.com</p>
                          <p><strong>Privacy:</strong> privacy@lightwell.com</p>
                          <p><strong>Security:</strong> security@lightwell.com</p>
                        </div>
                      </div>
                    </div>
                  )
                }
              ].map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {section.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      {expandedSection === section.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedSection === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 border-t border-gray-100"
                      >
                        {section.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Trust Indicators Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs text-white/60 mb-4">
                  <span className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    HIPAA Compliant Platform
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    SOC 2 Type II Certified
                  </span>
                  <span className="flex items-center">
                    <BadgeCheck className="w-4 h-4 mr-2" />
                    FDA Ready Technology
                  </span>
                </div>
                <p className="text-white/50 text-xs px-4">
                  Your JAMI-3 experience is secured by enterprise-grade Lightwell infrastructure
                </p>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between text-white/60 text-xs">
                <p>© 2025 Lightwell. All rights reserved.</p>
                <div className="flex items-center gap-6 mt-2 sm:mt-0">
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/safety" className="hover:text-white transition-colors">
                    Safety Protocols
                  </Link>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" />
                    JAMI-3 by Lightwell
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
