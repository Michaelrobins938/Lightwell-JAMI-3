'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Download,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Page Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-12 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
                <p className="text-slate-600 mt-2 font-medium">Last updated: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-slate-700 text-lg max-w-3xl leading-relaxed">
              We are committed to protecting your privacy and being transparent about how we collect, use, and protect your data.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-12 max-w-3xl">
            
            {/* Important Notice */}
            <div className="bg-white border-l-4 border-blue-500 rounded-r-lg p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold mb-2 text-lg">Important Privacy Notice</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    This service is not HIPAA-protected. While we implement strong security measures,
                    this chat is not the same as therapy confidentiality. Your conversations may be stored
                    and reviewed to improve safety and service quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-slate-700 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Name, email address, and date of birth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Emergency contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Account preferences and settings</span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">Conversation Data</h3>
                <ul className="space-y-2 text-slate-700 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Chat conversations and messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Assessment responses and wellness data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Usage patterns and interaction data</span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">Technical Information</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Device information and IP addresses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Browser type and operating system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Usage analytics and performance data</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We use your information for the following purposes:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-slate-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Safety and Crisis Prevention</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Detect crisis indicators, provide immediate safety support, and connect you with crisis resources when needed.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-slate-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Service Improvement</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Improve AI responses, enhance user experience, and develop better support features.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-slate-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Personalization</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Provide personalized support, recommendations, and content based on your needs and preferences.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-slate-600 text-sm font-bold">4</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Research and Development</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Conduct research to improve mental health support technology and develop new features.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-slate-600 text-sm font-bold">5</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Legal Compliance</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Comply with legal obligations, respond to legal requests, and protect our rights and safety.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Sharing and Disclosure</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your data in the following circumstances:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Safety Emergencies</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        If we detect an immediate safety risk, we may contact emergency services or crisis resources.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Legal Requirements</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        When required by law, court order, or government request.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Service Providers</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        With trusted third-party service providers who help us operate our service (under strict confidentiality agreements).
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Business Transfers</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        In connection with a merger, acquisition, or sale of assets (with appropriate privacy protections).
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="space-y-2 text-slate-700 mb-6">
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span>End-to-end encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span>Secure data centers with physical and digital security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span>Regular security audits and vulnerability assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span>Access controls and authentication requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span>Data anonymization and pseudonymization where possible</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  We cannot guarantee absolute security but we continuously work to improve our security measures.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We retain your data for the following periods:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Conversation Data</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Chat conversations and messages are retained for 2 years for safety and quality improvement purposes.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">7</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Legal Requirements</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Certain data may be retained for up to 7 years to comply with legal and regulatory requirements.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">∞</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Account Data</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Account information is retained until you request deletion or close your account.
                      </p>
                    </div>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4">
                  You can request deletion of your data at any time through your account settings or by contacting us.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Privacy Rights</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Access</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Request a copy of your personal data and information about how we use it.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Correction</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Request correction of inaccurate or incomplete personal data.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Deletion</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Request deletion of your personal data, subject to legal requirements.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Download className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Portability</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Request a copy of your data in a portable format.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Restriction</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Request restriction of processing in certain circumstances.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Objection</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Object to processing of your data for certain purposes.
                      </p>
                    </div>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4">
                  To exercise these rights, contact us at privacy@lightwell.com. We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies and Tracking</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="space-y-2 text-slate-700 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain your session and preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Analyze service usage and performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Improve user experience and functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Ensure security and prevent fraud</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies 
                  may affect the functionality of our service.
                </p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Third-Party Services</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Our service may integrate with third-party services for:
                </p>
                <ul className="space-y-2 text-slate-700 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Payment processing and billing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Analytics and performance monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Customer support and communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>AI and machine learning services</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  These services have their own privacy policies. We recommend reviewing their policies to understand 
                  how they handle your data.
                </p>
              </div>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Data Transfers</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Your data may be transferred to and processed in countries other than your own. We ensure that such transfers 
                  comply with applicable data protection laws and implement appropriate safeguards, including:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Standard contractual clauses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Adequacy decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Other appropriate safeguards</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Children's Privacy</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Our service is not intended for children under 13. We do not knowingly collect personal information 
                  from children under 13. If you are under 13, please do not use our service.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  For users between 13 and 18 years old, we implement additional privacy protections and require 
                  parental consent in accordance with applicable laws.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  If we become aware that we have collected personal information from a child under 13, 
                  we will take steps to delete such information promptly.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Policy</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We may update this privacy policy from time to time. We will notify you of significant changes by:
                </p>
                <ul className="space-y-2 text-slate-700 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Posting the updated policy on our website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Sending email notifications to registered users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Displaying in-app notifications</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  Your continued use of our service after changes become effective constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  If you have questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Privacy Team:</strong> privacy@lightwell.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@lightwell.com</p>
                    <p><strong>General Support:</strong> support@lightwell.com</p>
                    <p><strong>Legal Team:</strong> legal@lightwell.com</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4">
                  You also have the right to file a complaint with your local data protection authority 
                  if you believe we have not addressed your privacy concerns adequately.
                </p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-slate-600 text-sm">
                © 2025 Lightwell. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Terms of Service
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
    </div>
  );
}
