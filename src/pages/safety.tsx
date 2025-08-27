'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Heart, 
  Phone, 
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function SafetyProtocols() {
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
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Safety</span>
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
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Safety Protocols & Crisis Intervention</h1>
                <p className="text-green-100 mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-green-100 text-lg max-w-3xl">
              Your safety is our top priority. Learn about our comprehensive safety measures and crisis intervention procedures.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-8">
            
            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-900 font-semibold mb-2">Emergency Notice</h3>
                  <p className="text-red-800 text-sm leading-relaxed mb-3">
                    If you are experiencing a mental health emergency or crisis, please contact emergency services immediately:
                  </p>
                  <div className="space-y-1 text-red-800 text-sm">
                    <p><strong>Emergency Services:</strong> 911</p>
                    <p><strong>Suicide & Crisis Lifeline:</strong> 988</p>
                    <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Safety Overview</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Our platform implements comprehensive safety protocols designed to protect users and provide 
                  appropriate crisis intervention when needed. These protocols are based on mental health best practices 
                  and are continuously monitored and improved.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-slate-800">Real-time Monitoring</h3>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Advanced AI systems continuously monitor conversations for crisis indicators and safety concerns.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-slate-800">Immediate Response</h3>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Crisis detection triggers immediate safety interventions and resource provision.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-slate-800">Professional Integration</h3>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Seamless connection to human mental health professionals and crisis resources.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-slate-800">24/7 Availability</h3>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Round-the-clock safety monitoring and crisis support availability.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Crisis Detection */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Crisis Detection System</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Our AI system is trained to detect various types of crisis indicators:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Suicidal Ideation</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Thoughts of self-harm or suicide</li>
                      <li>• Specific plans or methods</li>
                      <li>• Access to lethal means</li>
                      <li>• Previous suicide attempts</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Severe Mental Health Symptoms</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Acute psychosis or hallucinations</li>
                      <li>• Severe depression or anxiety</li>
                      <li>• Manic episodes or extreme mood swings</li>
                      <li>• Disorganized thinking or behavior</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Substance Abuse</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Overdose risk or active overdose</li>
                      <li>• Severe withdrawal symptoms</li>
                      <li>• Impaired judgment or consciousness</li>
                      <li>• Dangerous substance combinations</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Violence Risk</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Threats of harm to self or others</li>
                      <li>• Access to weapons</li>
                      <li>• Violent ideation or plans</li>
                      <li>• Domestic violence situations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Crisis Response Protocol */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Crisis Response Protocol</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  When crisis indicators are detected, our system follows a structured response protocol:
                </p>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <h3 className="font-semibold text-red-900">Immediate Assessment</h3>
                    </div>
                    <p className="text-red-800 text-sm">
                      AI system immediately assesses the severity and nature of the crisis situation.
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-orange-900">Safety Validation</h3>
                    </div>
                    <p className="text-orange-800 text-sm">
                      System validates user safety and provides immediate crisis resources and support.
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <h3 className="font-semibold text-yellow-900">Resource Provision</h3>
                    </div>
                    <p className="text-yellow-800 text-sm">
                      Immediate provision of crisis hotlines, emergency contacts, and professional resources.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      <h3 className="font-semibold text-green-900">Professional Escalation</h3>
                    </div>
                    <p className="text-green-800 text-sm">
                      When necessary, automatic escalation to emergency services or crisis intervention teams.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Automatic Escalation */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Automatic Escalation Procedures</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  In certain crisis situations, our system may automatically escalate to emergency services:
                </p>
                <div className="space-y-4">
                  <div className="border border-red-200 rounded-xl p-6">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Immediate Emergency Escalation
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Active suicide attempts or plans with immediate means</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Overdose in progress or severe substance abuse emergency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Violent threats with immediate danger</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Severe psychotic episodes with safety concerns</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border border-orange-200 rounded-xl p-6">
                    <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Crisis Hotline Connection
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Suicidal thoughts without immediate plan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Severe depression or anxiety requiring immediate support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Substance abuse concerns requiring professional intervention</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Safety Features */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Safety Features & Protections</h2>
              <div className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 mb-3">Dependency Prevention</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Session time limits and frequency caps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Step-back prompts encouraging professional help</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Boundary setting and anti-dependency language</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Encouragement of real-world connections</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 mb-3">Youth Protection</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Age verification and restrictions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Parental consent requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Age-appropriate content and responses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Trusted adult involvement protocols</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Crisis Resources */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Crisis Resources</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Our platform provides immediate access to professional crisis resources:
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      National Crisis Hotlines
                    </h3>
                    <div className="space-y-2 text-blue-800">
                      <p><strong>988</strong> - Suicide & Crisis Lifeline (24/7)</p>
                      <p><strong>741741</strong> - Crisis Text Line (Text HOME)</p>
                      <p><strong>1-800-662-4357</strong> - SAMHSA National Helpline</p>
                      <p><strong>911</strong> - Emergency Services</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Specialized Resources
                    </h3>
                    <div className="space-y-2 text-purple-800">
                      <p><strong>1-800-656-4673</strong> - RAINN Sexual Assault Hotline</p>
                      <p><strong>1-800-799-7233</strong> - National Domestic Violence Hotline</p>
                      <p><strong>1-888-843-4564</strong> - LGBTQ National Hotline</p>
                      <p><strong>1-800-273-8255</strong> - Veterans Crisis Line</p>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Youth-Specific Resources
                    </h3>
                    <div className="space-y-2 text-green-800">
                      <p><strong>310-855-4673</strong> - Teen Line (or text TEEN to 839863)</p>
                      <p><strong>1-866-488-7386</strong> - The Trevor Project (LGBTQ+ Youth)</p>
                      <p><strong>1-800-931-2237</strong> - National Eating Disorders Association</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy in Crisis */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Privacy During Crisis</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  During crisis situations, we may need to share information to ensure your safety:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Emergency Services</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        If immediate danger is detected, we may contact emergency services with necessary information.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Crisis Resources</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        We may share relevant information with crisis hotlines or intervention teams.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Legal Requirements</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        We may be required to disclose information due to legal obligations or court orders.
                      </p>
                    </div>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4">
                  We always prioritize your safety over privacy in crisis situations, but we limit information sharing 
                  to what is necessary for your protection.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Your Safety Responsibilities</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  To ensure your safety while using our service:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Seek Professional Help</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Contact licensed mental health professionals for serious concerns or ongoing treatment.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Use Crisis Resources</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Call emergency services or crisis hotlines immediately if you're in crisis.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Maintain Boundaries</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Don't rely solely on AI support; maintain real-world connections and professional relationships.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Report Concerns</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Report any technical issues, safety concerns, or inappropriate content immediately.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Safety System Limitations</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  While our safety systems are comprehensive, they have limitations:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Not a Replacement for Professional Care</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Our safety systems cannot replace professional mental health assessment or treatment.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Technology Limitations</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        AI systems may not detect all crisis indicators or may generate false positives.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">Response Time</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        While we respond quickly, there may be delays in crisis detection or escalation.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-800">User Cooperation</strong>
                      <p className="text-slate-600 text-sm mt-1">
                        Safety systems rely on user cooperation and accurate information sharing.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Safety Support Contact</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  For questions about our safety protocols or to report safety concerns:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2 text-slate-700">
                    <p><strong>Safety Team:</strong> safety@luna-ai.com</p>
                    <p><strong>Crisis Support:</strong> crisis@luna-ai.com</p>
                    <p><strong>General Support:</strong> support@luna-ai.com</p>
                    <p><strong>Emergency:</strong> 911 (for immediate emergencies)</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4">
                  We take all safety reports seriously and respond promptly to ensure user protection.
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
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
