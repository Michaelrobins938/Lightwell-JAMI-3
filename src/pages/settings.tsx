import React, { useState } from 'react';
import Head from 'next/head';
import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import {
  BsGear, BsShield, BsBell, BsChatDots, BsToggles, BsToggles2, BsVolumeUp, BsVolumeOff
} from 'react-icons/bs';
import { MdAccessibility } from 'react-icons/md';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'range' | 'button';
  value?: boolean | string | number;
  options?: string[];
  min?: number;
  max?: number;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: 'General',
    icon: <BsGear className="w-5 h-5" />,
    description: 'Basic app preferences and behavior'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: <BsShield className="w-5 h-5" />,
    description: 'Control your data and security settings'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <BsBell className="w-5 h-5" />,
    description: 'Manage when and how you receive alerts'
  },
  {
    id: 'therapy',
    title: 'Therapy Settings',
    icon: <BsChatDots className="w-5 h-5" />,
    description: 'Customize your therapy experience'
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    icon: <MdAccessibility className="w-5 h-5" />,
    description: 'Make Lightwell work better for you'
  }
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General
    theme: 'dark',
    language: 'en',
    timezone: 'auto',
    startupPage: 'dashboard',
    
    // Privacy & Security
    dataSharing: false,
    analyticsOptIn: true,
    biometricAuth: false,
    sessionTimeout: 30,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    therapyReminders: true,
    crisisAlerts: true,
    marketingEmails: false,
    
    // Therapy
    voiceMode: true,
    autoSave: true,
    responseStyle: 'empathetic',
    sessionLength: 45,
    
    // Accessibility
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderToggle = (key: string, value: boolean) => (
    <button
      onClick={() => updateSetting(key, !value)}
      className="flex items-center"
    >
      {value ? (
        <BsToggles2 className="w-6 h-6 text-emerald-500" />
      ) : (
        <BsToggles className="w-6 h-6 text-zinc-500" />
      )}
    </button>
  );

  const renderSelect = (key: string, value: string, options: string[]) => (
    <select
      value={value}
      onChange={(e) => updateSetting(key, e.target.value)}
      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );

  const renderRange = (key: string, value: number, min: number, max: number, unit?: string) => (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => updateSetting(key, parseInt(e.target.value))}
        className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-zinc-400 min-w-12">
        {value}{unit}
      </span>
    </div>
  );

  const getSettingsForSection = (sectionId: string): SettingItem[] => {
    switch (sectionId) {
      case 'general':
        return [
          {
            id: 'theme',
            title: 'Theme',
            description: 'Choose your preferred color scheme',
            type: 'select',
            value: settings.theme,
            options: ['light', 'dark', 'system']
          },
          {
            id: 'language',
            title: 'Language',
            description: 'Select your preferred language',
            type: 'select',
            value: settings.language,
            options: ['en', 'es', 'fr', 'de', 'zh', 'ja']
          },
          {
            id: 'startupPage',
            title: 'Startup Page',
            description: 'Default page when opening the app',
            type: 'select',
            value: settings.startupPage,
            options: ['dashboard', 'chat', 'assessments', 'progress']
          }
        ];
      case 'privacy':
        return [
          {
            id: 'dataSharing',
            title: 'Data Sharing',
            description: 'Share anonymized data to improve our services',
            type: 'toggle',
            value: settings.dataSharing
          },
          {
            id: 'analyticsOptIn',
            title: 'Analytics',
            description: 'Help us improve by sharing usage analytics',
            type: 'toggle',
            value: settings.analyticsOptIn
          },
          {
            id: 'biometricAuth',
            title: 'Biometric Authentication',
            description: 'Use fingerprint or face recognition to sign in',
            type: 'toggle',
            value: settings.biometricAuth
          },
          {
            id: 'sessionTimeout',
            title: 'Session Timeout',
            description: 'Automatically sign out after inactivity',
            type: 'range',
            value: settings.sessionTimeout,
            min: 5,
            max: 120
          }
        ];
      case 'notifications':
        return [
          {
            id: 'pushNotifications',
            title: 'Push Notifications',
            description: 'Receive notifications on your device',
            type: 'toggle',
            value: settings.pushNotifications
          },
          {
            id: 'therapyReminders',
            title: 'Therapy Reminders',
            description: 'Get reminded about scheduled sessions',
            type: 'toggle',
            value: settings.therapyReminders
          },
          {
            id: 'crisisAlerts',
            title: 'Crisis Alerts',
            description: 'Receive immediate crisis support notifications',
            type: 'toggle',
            value: settings.crisisAlerts
          },
          {
            id: 'emailNotifications',
            title: 'Email Notifications',
            description: 'Receive updates and reminders via email',
            type: 'toggle',
            value: settings.emailNotifications
          }
        ];
      case 'therapy':
        return [
          {
            id: 'voiceMode',
            title: 'Voice Mode',
            description: 'Enable voice conversations with AI therapist',
            type: 'toggle',
            value: settings.voiceMode
          },
          {
            id: 'autoSave',
            title: 'Auto-save Sessions',
            description: 'Automatically save therapy session notes',
            type: 'toggle',
            value: settings.autoSave
          },
          {
            id: 'responseStyle',
            title: 'Response Style',
            description: 'How the AI should respond to you',
            type: 'select',
            value: settings.responseStyle,
            options: ['empathetic', 'analytical', 'motivational', 'gentle']
          },
          {
            id: 'sessionLength',
            title: 'Default Session Length',
            description: 'Preferred duration for therapy sessions',
            type: 'range',
            value: settings.sessionLength,
            min: 15,
            max: 90
          }
        ];
      case 'accessibility':
        return [
          {
            id: 'fontSize',
            title: 'Font Size',
            description: 'Adjust text size for better readability',
            type: 'select',
            value: settings.fontSize,
            options: ['small', 'medium', 'large', 'extra-large']
          },
          {
            id: 'highContrast',
            title: 'High Contrast',
            description: 'Increase color contrast for better visibility',
            type: 'toggle',
            value: settings.highContrast
          },
          {
            id: 'reducedMotion',
            title: 'Reduce Motion',
            description: 'Minimize animations and transitions',
            type: 'toggle',
            value: settings.reducedMotion
          },
          {
            id: 'screenReader',
            title: 'Screen Reader Support',
            description: 'Optimize for screen reading software',
            type: 'toggle',
            value: settings.screenReader
          }
        ];
      default:
        return [];
    }
  };

  return (
    <Layout>
      <Head>
        <title>Settings - Lightwell</title>
        <meta name="description" content="Customize your Lightwell experience with privacy, notification, and accessibility settings." />
      </Head>

      <div className="min-h-screen bg-zinc-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Customize your Lightwell experience to fit your needs and preferences.
            </p>
          </motion.div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 flex-shrink-0"
            >
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
                <nav className="space-y-2">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'hover:bg-zinc-800/50 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${activeSection === section.id ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {section.icon}
                        </div>
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs opacity-60">{section.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {settingsSections.find(s => s.id === activeSection)?.title}
                  </h2>
                  <p className="text-zinc-400">
                    {settingsSections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {getSettingsForSection(activeSection).map((setting) => (
                    <motion.div
                      key={setting.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-800/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{setting.title}</h3>
                        <p className="text-sm text-zinc-400">{setting.description}</p>
                      </div>
                      
                      <div className="ml-4">
                        {setting.type === 'toggle' && renderToggle(setting.id, setting.value as boolean)}
                        {setting.type === 'select' && renderSelect(setting.id, setting.value as string, setting.options!)}
                        {setting.type === 'range' && renderRange(
                          setting.id, 
                          setting.value as number, 
                          setting.min!, 
                          setting.max!,
                          setting.id === 'sessionTimeout' ? 'min' : 
                          setting.id === 'sessionLength' ? 'min' : ''
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}