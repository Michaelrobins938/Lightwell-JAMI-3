import React from 'react';
import Head from 'next/head';
import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { FaApple, FaWindows, FaLinux, FaAndroid, FaAppStore, FaGooglePlay } from 'react-icons/fa';
import { BsDownload, BsShield, BsCheckCircle } from 'react-icons/bs';
import { MdPhoneIphone, MdLaptop, MdTablet } from 'react-icons/md';

interface DownloadOption {
  platform: string;
  icon: React.ReactNode;
  description: string;
  version: string;
  size: string;
  requirements: string;
  downloadUrl: string;
  storeUrl?: string;
  isAvailable: boolean;
}

const downloadOptions: DownloadOption[] = [
  {
    platform: 'iOS',
    icon: <FaApple className="w-6 h-6" />,
    description: 'Get Lightwell for iPhone and iPad',
    version: '2.1.0',
    size: '45 MB',
    requirements: 'iOS 14.0 or later',
    downloadUrl: '#',
    storeUrl: 'https://apps.apple.com/app/lightwell',
    isAvailable: true
  },
  {
    platform: 'Android',
    icon: <FaAndroid className="w-6 h-6" />,
    description: 'Download for Android devices',
    version: '2.1.0',
    size: '52 MB',
    requirements: 'Android 8.0 (API level 26) or higher',
    downloadUrl: '#',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.lightwell',
    isAvailable: true
  },
  {
    platform: 'Windows',
    icon: <FaWindows className="w-6 h-6" />,
    description: 'Desktop app for Windows',
    version: '2.1.0',
    size: '120 MB',
    requirements: 'Windows 10 or later (64-bit)',
    downloadUrl: '#',
    isAvailable: true
  },
  {
    platform: 'macOS',
    icon: <FaApple className="w-6 h-6" />,
    description: 'Native macOS application',
    version: '2.1.0',
    size: '95 MB',
    requirements: 'macOS 11.0 (Big Sur) or later',
    downloadUrl: '#',
    isAvailable: true
  },
  {
    platform: 'Linux',
    icon: <FaLinux className="w-6 h-6" />,
    description: 'AppImage for Linux distributions',
    version: '2.1.0',
    size: '110 MB',
    requirements: 'Ubuntu 20.04+ / Fedora 34+ / Arch Linux',
    downloadUrl: '#',
    isAvailable: false
  }
];

const features = [
  {
    icon: <BsShield className="w-5 h-5 text-emerald-400" />,
    title: 'End-to-End Encryption',
    description: 'All your therapy sessions and data are encrypted both in transit and at rest.'
  },
  {
    icon: <MdPhoneIphone className="w-5 h-5 text-blue-400" />,
    title: 'Cross-Platform Sync',
    description: 'Start a conversation on your phone and continue on your desktop seamlessly.'
  },
  {
    icon: <BsCheckCircle className="w-5 h-5 text-green-400" />,
    title: 'Offline Mode',
    description: 'Access your therapy notes and completed assessments even without internet.'
  }
];

export default function Download() {
  return (
    <Layout>
      <Head>
        <title>Download Apps - Lightwell</title>
        <meta name="description" content="Download Lightwell apps for iOS, Android, Windows, macOS, and Linux. Access AI-powered mental healthcare anywhere." />
      </Head>

      <div className="min-h-screen bg-zinc-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Download Lightwell
            </h1>
            <p className="text-zinc-400 text-xl max-w-3xl mx-auto mb-8">
              Access your AI-powered mental healthcare companion on any device. 
              Secure, private, and always available when you need support.
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">500K+</div>
                <div className="text-zinc-500 text-sm">Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">4.8/5</div>
                <div className="text-zinc-500 text-sm">App Store Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">99.9%</div>
                <div className="text-zinc-500 text-sm">Uptime</div>
              </div>
            </div>
          </motion.div>

          {/* Download Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  option.isAvailable
                    ? 'bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50'
                    : 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-emerald-400">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {option.platform}
                  </h3>
                  {!option.isAvailable && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                
                <p className="text-zinc-400 mb-4">{option.description}</p>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Version:</span>
                    <span className="text-zinc-300">{option.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Size:</span>
                    <span className="text-zinc-300">{option.size}</span>
                  </div>
                  <div className="text-zinc-500 text-xs">
                    {option.requirements}
                  </div>
                </div>

                <div className="space-y-3">
                  {option.storeUrl && option.isAvailable && (
                    <a
                      href={option.storeUrl}
                      className="block w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 transform hover:scale-105"
                    >
                      {option.platform === 'iOS' && (
                        <>
                          <FaAppStore className="inline w-4 h-4 mr-2" />
                          App Store
                        </>
                      )}
                      {option.platform === 'Android' && (
                        <>
                          <FaGooglePlay className="inline w-4 h-4 mr-2" />
                          Google Play
                        </>
                      )}
                    </a>
                  )}
                  
                  <button
                    disabled={!option.isAvailable}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 ${
                      option.isAvailable
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <BsDownload className="inline w-4 h-4 mr-2" />
                    {option.isAvailable ? 'Direct Download' : 'Coming Soon'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Why Choose Our Apps?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 bg-zinc-900/30 rounded-xl border border-zinc-800"
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              System Requirements
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <MdPhoneIphone className="w-4 h-4 text-emerald-400" />
                  Mobile
                </h3>
                <ul className="space-y-1 text-zinc-400">
                  <li>• iOS 14.0+ (iPhone, iPad)</li>
                  <li>• Android 8.0+ (API 26)</li>
                  <li>• 2GB RAM minimum</li>
                  <li>• 100MB storage space</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <MdLaptop className="w-4 h-4 text-blue-400" />
                  Desktop
                </h3>
                <ul className="space-y-1 text-zinc-400">
                  <li>• Windows 10+ (64-bit)</li>
                  <li>• macOS 11.0+ (Big Sur)</li>
                  <li>• Ubuntu 20.04+ / Similar</li>
                  <li>• 4GB RAM recommended</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <MdTablet className="w-4 h-4 text-purple-400" />
                  Web Browser
                </h3>
                <ul className="space-y-1 text-zinc-400">
                  <li>• Chrome 90+</li>
                  <li>• Firefox 88+</li>
                  <li>• Safari 14+</li>
                  <li>• Edge 90+</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Beta Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 p-8 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Join Our Beta Program
            </h2>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Get early access to new features and help shape the future of Lightwell. 
              Beta testers receive priority support and exclusive updates.
            </p>
            <button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
              Join Beta Program
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}