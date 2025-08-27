'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accessibility, 
  Eye, 
  Ear, 
  MousePointer, 
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function AccessibilityCompliance() {
  const lastUpdated = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Accessibility</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Page Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Accessibility className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Accessibility Statement</h1>
                <p className="text-purple-100 mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-purple-100 text-lg max-w-3xl">
              We are committed to ensuring our mental health platform is accessible to all users, 
              including those with disabilities, in compliance with ADA and WCAG guidelines.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-8">
            
            {/* Commitment Statement */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Accessibility className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-purple-900 font-semibold mb-2">Our Commitment</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    Luna AI is committed to providing an inclusive and accessible experience for all users. 
                    We believe that mental health support should be available to everyone, regardless of ability. 
                    Our platform is designed and developed with accessibility as a core principle.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Standards */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Compliance Standards</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-slate-800">WCAG 2.1 AA Compliance</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Our platform meets Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, 
                    ensuring accessibility for users with various disabilities.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Perceivable content and interface elements</li>
                    <li>• Operable user interface and navigation</li>
                    <li>• Understandable information and operation</li>
                    <li>• Robust content compatible with assistive technologies</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-800">ADA Title III Compliance</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    We comply with the Americans with Disabilities Act (ADA) Title III requirements 
                    for public accommodations and commercial facilities.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Equal access to mental health services</li>
                    <li>• Effective communication accommodations</li>
                    <li>• Reasonable modifications when needed</li>
                    <li>• Integration with assistive technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Accessibility Features */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessibility Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Visual Accessibility
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>High contrast mode and color customization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Resizable text (up to 200% zoom)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Screen reader compatibility (NVDA, JAWS, VoiceOver)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Alternative text for all images and graphics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Keyboard navigation support</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Ear className="w-5 h-5 text-green-600" />
                    Audio Accessibility
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Closed captions for all video content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Audio descriptions for visual content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Volume controls and audio pause options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Text-to-speech functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Visual indicators for audio events</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <MousePointer className="w-5 h-5 text-purple-600" />
                    Motor Accessibility
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Full keyboard navigation support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Voice control compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Adjustable timing for interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Large click targets and touch areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Switch device compatibility</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-600" />
                    Cognitive Accessibility
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Clear, simple language and instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Consistent navigation and layout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Error prevention and recovery options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Progress indicators and status updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Customizable interface complexity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Assistive Technology Support */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Assistive Technology Support</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Our platform is designed to work seamlessly with a wide range of assistive technologies:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Screen Readers</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>NVDA (NonVisual Desktop Access)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>JAWS (Job Access With Speech)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>VoiceOver (macOS and iOS)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>TalkBack (Android)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Other Assistive Technologies</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Voice recognition software</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Switch devices and eye tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Magnification software</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Braille displays</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Testing and Validation */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Testing and Validation</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We regularly test our platform for accessibility compliance using multiple methods:
                </p>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Automated Testing</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>WAVE Web Accessibility Evaluator</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>axe-core automated testing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Lighthouse accessibility audits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Continuous integration testing</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Manual Testing</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Screen reader testing with real users</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Keyboard-only navigation testing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Color contrast verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>User testing with people with disabilities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Known Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Known Limitations</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-amber-900 font-semibold mb-2">Current Limitations</h3>
                    <p className="text-amber-800 text-sm leading-relaxed mb-3">
                      While we strive for full accessibility, we acknowledge some current limitations:
                    </p>
                    <ul className="space-y-2 text-amber-800 text-sm">
                      <li>• Some advanced AI features may have limited screen reader support</li>
                      <li>• Voice interaction features are primarily English-language</li>
                      <li>• Complex data visualizations may require alternative formats</li>
                      <li>• Third-party integrations may have varying accessibility levels</li>
                    </ul>
                    <p className="text-amber-800 text-sm mt-3">
                      We are actively working to address these limitations and improve accessibility 
                      with each platform update.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feedback and Support */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Feedback and Support</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We welcome feedback on accessibility issues and suggestions for improvement:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Accessibility Team:</strong> accessibility@luna-ai.com</p>
                    <p><strong>Technical Support:</strong> support@luna-ai.com</p>
                    <p><strong>General Inquiries:</strong> info@luna-ai.com</p>
                    <p><strong>Phone Support:</strong> 1-800-LUNA-AI (available during business hours)</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4">
                  We aim to respond to accessibility feedback within 48 hours and address 
                  critical accessibility issues as a priority.
                </p>
              </div>
            </section>

            {/* Alternative Formats */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Alternative Formats</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We provide alternative formats for our content and services:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Document Formats</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Large print versions available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Audio versions of written content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Braille versions upon request</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Plain text alternatives</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Communication Support</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>ASL interpretation services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Real-time captioning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Text-based support options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Extended response times available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessibility Contact</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  For accessibility questions, concerns, or requests for accommodations:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Accessibility Coordinator:</strong> accessibility@luna-ai.com</p>
                    <p><strong>Technical Accessibility:</strong> tech-accessibility@luna-ai.com</p>
                    <p><strong>User Experience:</strong> ux-accessibility@luna-ai.com</p>
                    <p><strong>General Support:</strong> support@luna-ai.com</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4">
                  We are committed to providing reasonable accommodations and will work with you 
                  to ensure you can access our mental health services effectively.
                </p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-slate-600 text-sm">
                © 2025 Luna AI. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/safety" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Safety Protocols
                </Link>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
