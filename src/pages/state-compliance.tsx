'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function StateCompliance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const lastUpdated = 'January 15, 2025';

  // State compliance data
  const stateComplianceData = [
    {
      state: 'California',
      category: 'strict',
      requirements: [
        'CCPA compliance required',
        'Mental health parity laws apply',
        'Telehealth consent requirements',
        'Minor consent laws (12+ for mental health)',
        'Data breach notification within 72 hours'
      ],
      specialNotes: 'Most comprehensive privacy laws in the US'
    },
    {
      state: 'New York',
      category: 'strict',
      requirements: [
        'SHIELD Act compliance',
        'Mental health parity enforcement',
        'Telehealth provider licensing',
        'Minor consent (14+ for mental health)',
        'Data security requirements'
      ],
      specialNotes: 'Strong consumer protection laws'
    },
    {
      state: 'Texas',
      category: 'moderate',
      requirements: [
        'Telehealth parity laws',
        'Mental health provider licensing',
        'Minor consent (16+ for mental health)',
        'Data breach notification',
        'Professional liability requirements'
      ],
      specialNotes: 'Telehealth-friendly regulations'
    },
    {
      state: 'Florida',
      category: 'moderate',
      requirements: [
        'Telehealth practice standards',
        'Mental health provider requirements',
        'Minor consent (14+ for mental health)',
        'Data security standards',
        'Professional liability insurance'
      ],
      specialNotes: 'Growing telehealth market'
    },
    {
      state: 'Illinois',
      category: 'strict',
      requirements: [
        'BIPA compliance required',
        'Mental health parity laws',
        'Telehealth consent requirements',
        'Minor consent (12+ for mental health)',
        'Data breach notification'
      ],
      specialNotes: 'Biometric data protection laws'
    },
    {
      state: 'Massachusetts',
      category: 'strict',
      requirements: [
        'Data security regulations',
        'Mental health parity enforcement',
        'Telehealth provider licensing',
        'Minor consent (14+ for mental health)',
        'Professional standards requirements'
      ],
      specialNotes: 'Strong healthcare regulations'
    },
    {
      state: 'Colorado',
      category: 'moderate',
      requirements: [
        'Consumer data privacy laws',
        'Mental health parity',
        'Telehealth practice standards',
        'Minor consent (15+ for mental health)',
        'Data breach notification'
      ],
      specialNotes: 'Progressive privacy laws'
    },
    {
      state: 'Washington',
      category: 'moderate',
      requirements: [
        'Consumer data protection',
        'Mental health parity laws',
        'Telehealth provider requirements',
        'Minor consent (13+ for mental health)',
        'Data security standards'
      ],
      specialNotes: 'Tech-friendly regulations'
    },
    {
      state: 'Virginia',
      category: 'moderate',
      requirements: [
        'CDPA compliance',
        'Mental health provider licensing',
        'Telehealth practice standards',
        'Minor consent (14+ for mental health)',
        'Data breach notification'
      ],
      specialNotes: 'First state with comprehensive privacy law'
    },
    {
      state: 'Connecticut',
      category: 'strict',
      requirements: [
        'Data privacy laws',
        'Mental health parity enforcement',
        'Telehealth consent requirements',
        'Minor consent (12+ for mental health)',
        'Professional liability requirements'
      ],
      specialNotes: 'Strong consumer protection'
    }
  ];

  // Add remaining states with basic requirements
  const remainingStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Delaware', 'Georgia', 'Hawaii',
    'Idaho', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Utah', 'Vermont', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  remainingStates.forEach(state => {
    stateComplianceData.push({
      state,
      category: 'basic',
      requirements: [
        'Federal privacy laws apply',
        'Mental health provider licensing',
        'Telehealth practice standards',
        'Minor consent (varies by state)',
        'Data breach notification'
      ],
      specialNotes: 'Standard federal compliance required'
    });
  });

  const filteredStates = stateComplianceData.filter(state => {
    const matchesSearch = state.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || state.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strict': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'basic': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'strict': return 'Strict Requirements';
      case 'moderate': return 'Moderate Requirements';
      case 'basic': return 'Basic Requirements';
      default: return 'Unknown';
    }
  };

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
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">State Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Page Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">State Compliance Guide</h1>
                <p className="text-blue-100 mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-blue-100 text-lg max-w-3xl">
              Comprehensive guide to state-specific legal requirements for mental health services, 
              telehealth, and AI platforms across all 50 states.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-8">
            
            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-amber-900 font-semibold mb-2">Legal Disclaimer</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    This guide provides general information about state compliance requirements. 
                    Laws and regulations change frequently. Always consult with qualified legal counsel 
                    for specific compliance advice in your jurisdiction.
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="strict">Strict Requirements</option>
                <option value="moderate">Moderate Requirements</option>
                <option value="basic">Basic Requirements</option>
              </select>
            </div>

            {/* Compliance Categories */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Compliance Categories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">Strict Requirements</h3>
                  </div>
                  <p className="text-red-800 text-sm">
                    States with comprehensive privacy laws, strict telehealth regulations, 
                    and detailed mental health parity requirements.
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Moderate Requirements</h3>
                  </div>
                  <p className="text-orange-800 text-sm">
                    States with some specific regulations but generally standard 
                    telehealth and privacy requirements.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Basic Requirements</h3>
                  </div>
                  <p className="text-green-800 text-sm">
                    States following standard federal requirements with minimal 
                    additional state-specific regulations.
                  </p>
                </div>
              </div>
            </section>

            {/* State Listings */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                State-Specific Requirements ({filteredStates.length} states)
              </h2>
              <div className="grid gap-6">
                {filteredStates.map((state, index) => (
                  <motion.div
                    key={state.state}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{state.state}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(state.category)}`}>
                          {getCategoryLabel(state.category)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Key Requirements:</h4>
                        <ul className="space-y-1">
                          {state.requirements.map((requirement, reqIndex) => (
                            <li key={reqIndex} className="flex items-start gap-2 text-slate-700 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {state.specialNotes && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-slate-700 text-sm">
                            <strong>Note:</strong> {state.specialNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Federal Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Federal Requirements (All States)</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  The following federal requirements apply to all states:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Privacy & Data Protection</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>HIPAA compliance for covered entities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>COPPA compliance for users under 13</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Data breach notification requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>User data access and deletion rights</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Mental Health Services</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Mental health parity laws</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Crisis intervention protocols</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Professional liability requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Informed consent requirements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance Checklist */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Compliance Checklist</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Essential Compliance Steps:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Legal Review</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Consult with qualified legal counsel familiar with your target states
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Privacy Policy Updates</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Ensure privacy policies comply with state-specific requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Data Processing</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Implement state-specific data handling and retention policies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">User Consent</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Update consent mechanisms for state-specific requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Ongoing Monitoring</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Establish processes to track regulatory changes and updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Legal Support</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  For questions about state-specific compliance requirements:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Legal Team:</strong> legal@luna-ai.com</p>
                    <p><strong>Compliance Officer:</strong> compliance@luna-ai.com</p>
                    <p><strong>Privacy Team:</strong> privacy@luna-ai.com</p>
                    <p><strong>General Support:</strong> support@luna-ai.com</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4">
                  We recommend consulting with qualified legal counsel familiar with 
                  healthcare law and state-specific regulations in your target markets.
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
