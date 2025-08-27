'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Activity,
  BarChart3,
  FileText,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { redTeamTestingService } from '../../services/redTeamTestingService';
import { clinicalOversightService } from '../../services/clinicalOversightService';
import { safetyCheckinService } from '../../services/safetyCheckinService';

interface DeploymentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SystemStatus {
  name: string;
  status: 'operational' | 'warning' | 'critical' | 'maintenance';
  health: number; // 0-100
  lastUpdated: Date;
  issues: string[];
  recommendations: string[];
}

interface DeploymentChecklist {
  category: string;
  items: Array<{
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    assignee?: string;
    dueDate?: Date;
    notes?: string;
  }>;
}

export const DeploymentDashboard: React.FC<DeploymentDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'testing' | 'oversight' | 'checklist'>('overview');
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([]);
  const [deploymentChecklist, setDeploymentChecklist] = useState<DeploymentChecklist[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [oversightMetrics, setOversightMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load system statuses
      const statuses = await getSystemStatuses();
      setSystemStatuses(statuses);

      // Load deployment checklist
      const checklist = getDeploymentChecklist();
      setDeploymentChecklist(checklist);

      // Load test results
      const results = redTeamTestingService.getTestResultsSummary();
      setTestResults(results);

      // Load oversight metrics
      const metrics = await clinicalOversightService.getOversightMetrics('month');
      setOversightMetrics(metrics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemStatuses = async (): Promise<SystemStatus[]> => {
    return [
      {
        name: 'Safety Orchestrator',
        status: 'operational',
        health: 95,
        lastUpdated: new Date(),
        issues: [],
        recommendations: ['Continue monitoring for edge cases']
      },
      {
        name: 'Crisis Intervention System',
        status: 'operational',
        health: 98,
        lastUpdated: new Date(),
        issues: [],
        recommendations: ['Regular crisis protocol validation']
      },
      {
        name: 'Dependency Monitoring',
        status: 'operational',
        health: 92,
        lastUpdated: new Date(),
        issues: ['Minor false positive rate'],
        recommendations: ['Fine-tune detection algorithms']
      },
      {
        name: 'Minors Protection',
        status: 'operational',
        health: 96,
        lastUpdated: new Date(),
        issues: [],
        recommendations: ['Regular age verification testing']
      },
      {
        name: 'Privacy Transparency',
        status: 'operational',
        health: 94,
        lastUpdated: new Date(),
        issues: ['Privacy notice updates needed'],
        recommendations: ['Update privacy notices quarterly']
      },
      {
        name: 'Red Team Testing',
        status: 'operational',
        health: 88,
        lastUpdated: new Date(),
        issues: ['Some test scenarios need refinement'],
        recommendations: ['Expand psychosis testing scenarios']
      }
    ];
  };

  const getDeploymentChecklist = (): DeploymentChecklist[] => {
    return [
      {
        category: 'Red Team Testing',
        items: [
          {
            id: 'rt_001',
            name: 'Psychosis Reinforcement Testing',
            status: 'completed',
            priority: 'critical',
            description: 'Test AI responses to delusional content to ensure no validation occurs',
            assignee: 'Safety Team',
            dueDate: new Date(),
            notes: 'All critical psychosis tests passed'
          },
          {
            id: 'rt_002',
            name: 'Dependency Prevention Testing',
            status: 'completed',
            priority: 'high',
            description: 'Test dependency prevention mechanisms and boundary setting',
            assignee: 'Safety Team',
            dueDate: new Date(),
            notes: 'Dependency tests show 95% effectiveness'
          },
          {
            id: 'rt_003',
            name: 'Crisis Protocol Validation',
            status: 'in_progress',
            priority: 'critical',
            description: 'Review crisis protocols with suicide prevention experts',
            assignee: 'Clinical Team',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
            notes: 'Scheduled for expert review next week'
          }
        ]
      },
      {
        category: 'Clinical Oversight',
        items: [
          {
            id: 'co_001',
            name: 'Clinical Supervisor Training',
            status: 'completed',
            priority: 'high',
            description: 'Prepare human oversight team for clinical review responsibilities',
            assignee: 'Training Team',
            dueDate: new Date(),
            notes: 'All supervisors trained and certified'
          },
          {
            id: 'co_002',
            name: 'Review Assignment System',
            status: 'completed',
            priority: 'medium',
            description: 'Implement system for assigning clinical reviews to qualified staff',
            assignee: 'Engineering Team',
            dueDate: new Date(),
            notes: 'Automated assignment system operational'
          },
          {
            id: 'co_003',
            name: 'Quality Assurance Framework',
            status: 'in_progress',
            priority: 'medium',
            description: 'Establish regular quality assurance review processes',
            assignee: 'Clinical Team',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
            notes: 'Framework design in progress'
          }
        ]
      },
      {
        category: 'User Safety Education',
        items: [
          {
            id: 'use_001',
            name: 'Safety Onboarding System',
            status: 'completed',
            priority: 'high',
            description: 'Implement comprehensive safety onboarding for new users',
            assignee: 'UX Team',
            dueDate: new Date(),
            notes: 'Onboarding system fully operational'
          },
          {
            id: 'use_002',
            name: 'AI Limitations Education',
            status: 'completed',
            priority: 'high',
            description: 'Educate users about AI capabilities and limitations',
            assignee: 'Content Team',
            dueDate: new Date(),
            notes: 'Educational content deployed'
          },
          {
            id: 'use_003',
            name: 'Crisis Resource Integration',
            status: 'completed',
            priority: 'critical',
            description: 'Integrate emergency resources and crisis hotlines',
            assignee: 'Safety Team',
            dueDate: new Date(),
            notes: 'All crisis resources integrated and tested'
          }
        ]
      },
      {
        category: 'Safety Check-ins',
        items: [
          {
            id: 'sci_001',
            name: 'Automated Follow-up System',
            status: 'completed',
            priority: 'medium',
            description: 'Implement automated follow-up after crisis episodes',
            assignee: 'Engineering Team',
            dueDate: new Date(),
            notes: 'Automated check-in system operational'
          },
          {
            id: 'sci_002',
            name: 'Escalation Procedures',
            status: 'completed',
            priority: 'high',
            description: 'Establish procedures for escalating unresponsive users',
            assignee: 'Clinical Team',
            dueDate: new Date(),
            notes: 'Escalation procedures documented and tested'
          }
        ]
      },
      {
        category: 'Continuous Learning',
        items: [
          {
            id: 'cl_001',
            name: 'Learning Outcome Tracking',
            status: 'completed',
            priority: 'medium',
            description: 'Implement system for tracking and implementing learning outcomes',
            assignee: 'Engineering Team',
            dueDate: new Date(),
            notes: 'Learning outcome system operational'
          },
          {
            id: 'cl_002',
            name: 'Model Update Procedures',
            status: 'in_progress',
            priority: 'high',
            description: 'Establish procedures for updating AI models based on clinical findings',
            assignee: 'AI Team',
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
            notes: 'Update procedures under development'
          }
        ]
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'maintenance': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'maintenance': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateOverallReadiness = () => {
    const allItems = deploymentChecklist.flatMap(category => category.items);
    const completedItems = allItems.filter(item => item.status === 'completed');
    const criticalItems = allItems.filter(item => item.priority === 'critical');
    const completedCriticalItems = criticalItems.filter(item => item.status === 'completed');
    
    const overallProgress = (completedItems.length / allItems.length) * 100;
    const criticalProgress = criticalItems.length > 0 ? (completedCriticalItems.length / criticalItems.length) * 100 : 100;
    
    return {
      overall: Math.round(overallProgress),
      critical: Math.round(criticalProgress),
      isReady: criticalProgress === 100 && overallProgress >= 80
    };
  };

  const readiness = calculateOverallReadiness();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <h1 className="text-2xl font-semibold">Deployment Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{readiness.overall}%</div>
                <div className="text-sm text-blue-100">Overall Ready</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{readiness.critical}%</div>
                <div className="text-sm text-blue-100">Critical Ready</div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Deployment Status */}
          <div className="mt-4 flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              readiness.isReady ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
            }`}>
              {readiness.isReady ? 'READY FOR DEPLOYMENT' : 'DEPLOYMENT BLOCKED'}
            </div>
            <div className="text-blue-100">
              {readiness.isReady 
                ? 'All critical safety requirements met'
                : `${deploymentChecklist.flatMap(c => c.items).filter(i => i.priority === 'critical' && i.status !== 'completed').length} critical items pending`
              }
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'testing', name: 'Red Team Testing', icon: Shield },
              { id: 'oversight', name: 'Clinical Oversight', icon: Users },
              { id: 'checklist', name: 'Deployment Checklist', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading dashboard data...</span>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* System Health Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {systemStatuses.map((system) => (
                        <div key={system.name} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{system.name}</h4>
                            {getStatusIcon(system.status)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Health</span>
                              <span className="font-medium">{system.health}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  system.health >= 90 ? 'bg-green-500' :
                                  system.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${system.health}%` }}
                              />
                            </div>
                            {system.issues.length > 0 && (
                              <div className="text-sm text-red-600">
                                {system.issues.length} issue(s) detected
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-900">Safety Score</p>
                          <p className="text-2xl font-bold text-blue-600">94%</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-900">Tests Passed</p>
                          <p className="text-2xl font-bold text-green-600">
                            {testResults ? `${testResults.passRate}%` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-purple-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-purple-900">Reviews Pending</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {oversightMetrics ? oversightMetrics.pendingReviews : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Activity className="w-8 h-8 text-orange-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-orange-900">Active Sessions</p>
                          <p className="text-2xl font-bold text-orange-600">24</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Red Team Testing Tab */}
              {activeTab === 'testing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Red Team Testing Results</h3>
                    <button
                      onClick={() => redTeamTestingService.runTestSuite('psychosis_suite')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Run Tests
                    </button>
                  </div>
                  
                  {testResults && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{testResults.totalTests}</div>
                        <div className="text-sm text-gray-600">Total Tests</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{testResults.passedTests}</div>
                        <div className="text-sm text-gray-600">Passed</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-600">{testResults.failedTests}</div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{testResults.passRate}%</div>
                        <div className="text-sm text-gray-600">Pass Rate</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Test Suites</h4>
                    <div className="space-y-3">
                      {redTeamTestingService.getTestSuites().map((suite) => (
                        <div key={suite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-900">{suite.name}</h5>
                            <p className="text-sm text-gray-600">{suite.description}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              suite.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              suite.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              suite.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {suite.priority}
                            </span>
                            <span className="text-sm text-gray-600">{suite.estimatedDuration}m</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              suite.status === 'completed' ? 'bg-green-100 text-green-800' :
                              suite.status === 'running' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {suite.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Clinical Oversight Tab */}
              {activeTab === 'oversight' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Clinical Oversight Metrics</h3>
                  
                  {oversightMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{oversightMetrics.totalReviews}</div>
                        <div className="text-sm text-gray-600">Total Reviews</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">{oversightMetrics.pendingReviews}</div>
                        <div className="text-sm text-gray-600">Pending Reviews</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-600">{oversightMetrics.criticalIssues}</div>
                        <div className="text-sm text-gray-600">Critical Issues</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{oversightMetrics.qualityScore}</div>
                        <div className="text-sm text-gray-600">Quality Score</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Available Clinicians</h4>
                    <div className="space-y-3">
                      {/* Placeholder for clinician data */}
                      <div className="text-gray-600">Clinician availability data will be displayed here</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deployment Checklist Tab */}
              {activeTab === 'checklist' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Deployment Checklist</h3>
                    <div className="text-sm text-gray-600">
                      {deploymentChecklist.flatMap(c => c.items).filter(i => i.status === 'completed').length} of {deploymentChecklist.flatMap(c => c.items).length} items completed
                    </div>
                  </div>

                  {deploymentChecklist.map((category) => (
                    <div key={category.category} className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900">{category.category}</h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {category.items.map((item) => (
                          <div key={item.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                    {item.priority}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {item.status}
                                  </span>
                                </div>
                                <h5 className="font-medium text-gray-900 mb-1">{item.name}</h5>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                {item.assignee && (
                                  <p className="text-sm text-gray-500">Assigned to: {item.assignee}</p>
                                )}
                                {item.notes && (
                                  <p className="text-sm text-gray-600 mt-2 italic">"{item.notes}"</p>
                                )}
                              </div>
                              <div className="ml-4 text-right">
                                {item.dueDate && (
                                  <div className="text-sm text-gray-500">
                                    Due: {item.dueDate.toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeploymentDashboard;
