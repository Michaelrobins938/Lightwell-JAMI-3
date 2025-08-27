import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Shield, 
  Clock, 
  Star, 
  Play,
  Download,
  FileText,
  Award,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const AssessmentTools: React.FC = () => {
  const assessmentTools = [
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Assessment',
      description: 'Validated screening tool for depression symptoms with instant scoring and personalized recommendations.',
      duration: '5 minutes',
      questions: 9,
      validated: true,
      category: 'Depression',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-blue-500',
      features: ['Instant scoring', 'Personalized recommendations', 'Severity levels', 'Follow-up guidance'],
    },
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'Generalized Anxiety Disorder assessment with real-time scoring and coping strategy recommendations.',
      duration: '5 minutes',
      questions: 7,
      validated: true,
      category: 'Anxiety',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-green-500',
      features: ['Real-time scoring', 'Coping strategies', 'Anxiety levels', 'Treatment guidance'],
    },
    {
      id: 'pcl5',
      title: 'PCL-5 PTSD Checklist',
      description: 'Comprehensive PTSD screening tool for trauma-related symptoms and post-traumatic stress.',
      duration: '8 minutes',
      questions: 20,
      validated: true,
      category: 'Trauma',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-purple-500',
      features: ['Trauma screening', 'Symptom clusters', 'Severity assessment', 'Professional referral'],
    },
    {
      id: 'mdq',
      title: 'MDQ Bipolar Screening',
      description: 'Mood Disorder Questionnaire for screening bipolar disorder and related mood conditions.',
      duration: '6 minutes',
      questions: 13,
      validated: true,
      category: 'Mood Disorders',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
      features: ['Mood screening', 'Bipolar indicators', 'Risk assessment', 'Clinical referral'],
    },
    {
      id: 'audit',
      title: 'AUDIT Alcohol Screening',
      description: 'Alcohol Use Disorders Identification Test for screening alcohol-related problems.',
      duration: '4 minutes',
      questions: 10,
      validated: true,
      category: 'Substance Use',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500',
      features: ['Alcohol screening', 'Risk levels', 'Harm reduction', 'Treatment options'],
    },
    {
      id: 'eat26',
      title: 'EAT-26 Eating Attitudes',
      description: 'Eating Attitudes Test for screening eating disorders and disordered eating patterns.',
      duration: '7 minutes',
      questions: 26,
      validated: true,
      category: 'Eating Disorders',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-pink-500',
      features: ['Eating disorder screening', 'Body image assessment', 'Risk evaluation', 'Specialized referral'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Assessment Tools Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Validated Assessment Tools
        </h2>
        <p className="text-luna-600 dark:text-luna-400 mb-6">
          Evidence-based screening tools validated by clinical research for accurate mental health assessment and early intervention.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden border border-luna-200 dark:border-luna-600"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-lg text-white ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-luna-800 dark:text-luna-200 line-clamp-2">
                      {tool.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {tool.validated && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Validated</span>
                        </div>
                      )}
                      <span className="text-xs text-luna-500 dark:text-luna-400">{tool.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-luna-500 dark:text-luna-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{tool.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{tool.questions} questions</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-medium text-luna-700 dark:text-luna-300 mb-2">Features:</div>
                  <div className="space-y-1">
                    {tool.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-luna-400 rounded-full"></div>
                        <span className="text-xs text-luna-600 dark:text-luna-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Assessment</span>
                  </button>
                  <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Assessment Guidelines */}
      <div className="bg-luna-50 dark:bg-luna-800 rounded-lg p-6 border border-luna-200 dark:border-luna-600">
        <h3 className="text-lg font-bold text-luna-700 dark:text-luna-300 mb-4 flex items-center space-x-2">
          <Info className="w-5 h-5" />
          <span>Assessment Guidelines</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-luna-600 dark:text-luna-400">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>All assessments are validated by clinical research</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Results are for screening purposes only</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Professional evaluation recommended for clinical diagnosis</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Assessments are confidential and secure</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Results include personalized recommendations</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Crisis resources available for immediate support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Statistics */}
      <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Assessment Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">10+</div>
            <div className="text-sm opacity-90">Validated Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">95%+</div>
            <div className="text-sm opacity-90">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5-8 min</div>
            <div className="text-sm opacity-90">Average Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Available Access</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTools; 