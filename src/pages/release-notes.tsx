import React from 'react';
import Head from 'next/head';
import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { BsStars, BsShield, BsBug } from 'react-icons/bs';
import { MdNewReleases, MdBugReport, MdSecurity } from 'react-icons/md';

interface ReleaseNote {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  fixes?: Array<{
    title: string;
    description: string;
  }>;
  security?: Array<{
    title: string;
    description: string;
  }>;
}

const releaseNotes: ReleaseNote[] = [
  {
    version: "2.1.0",
    date: "2025-01-15",
    type: "major",
    features: [
      {
        title: "Enhanced AI Therapy Sessions",
        description: "Introduced advanced personality management and memory insights for more personalized therapy experiences.",
        icon: <MdNewReleases className="w-5 h-5 text-emerald-500" />
      },
      {
        title: "Team Workspaces",
        description: "New collaborative features allowing healthcare teams to work together more effectively.",
        icon: <BsStars className="w-5 h-5 text-blue-500" />
      },
      {
        title: "Plugin System",
        description: "Extensible plugin architecture for integrating third-party tools and services.",
        icon: <BsStars className="w-5 h-5 text-purple-500" />
      }
    ],
    fixes: [
      {
        title: "Chat Interface Improvements",
        description: "Fixed scrolling issues and improved message rendering performance."
      },
      {
        title: "Authentication Stability",
        description: "Resolved login session timeout issues and improved security."
      }
    ],
    security: [
      {
        title: "Enhanced Data Encryption",
        description: "Upgraded to AES-256 encryption for all patient data storage and transmission."
      }
    ]
  },
  {
    version: "2.0.5",
    date: "2025-01-01",
    type: "patch",
    features: [
      {
        title: "Voice Mode Improvements",
        description: "Better audio quality and reduced latency in voice conversations.",
        icon: <BsStars className="w-5 h-5 text-green-500" />
      }
    ],
    fixes: [
      {
        title: "Mobile Responsiveness",
        description: "Fixed layout issues on mobile devices and improved touch interactions."
      },
      {
        title: "Assessment Loading",
        description: "Resolved slow loading times for mental health assessments."
      }
    ]
  },
  {
    version: "2.0.0",
    date: "2024-12-15",
    type: "major",
    features: [
      {
        title: "Complete UI Overhaul",
        description: "Modern, accessible interface designed for healthcare professionals and patients.",
        icon: <MdNewReleases className="w-5 h-5 text-blue-600" />
      },
      {
        title: "HIPAA Compliance",
        description: "Full HIPAA compliance with end-to-end encryption and audit trails.",
        icon: <BsShield className="w-5 h-5 text-green-600" />
      },
      {
        title: "Crisis Intervention System",
        description: "AI-powered crisis detection with immediate intervention protocols.",
        icon: <MdSecurity className="w-5 h-5 text-red-500" />
      }
    ],
    security: [
      {
        title: "Zero-Trust Architecture",
        description: "Implemented zero-trust security model for all system access."
      },
      {
        title: "Penetration Testing",
        description: "Completed comprehensive security audit by third-party specialists."
      }
    ]
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'major':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'minor':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'patch':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ReleaseNotes() {
  return (
    <Layout>
      <Head>
        <title>Release Notes - Lightwell</title>
        <meta name="description" content="Latest updates and improvements to the Lightwell AI healthcare platform." />
      </Head>

      <div className="min-h-screen bg-zinc-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Release Notes
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and security updates to Lightwell.
            </p>
          </motion.div>

          {/* Release Notes */}
          <div className="space-y-8">
            {releaseNotes.map((release, index) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-6"
              >
                {/* Version Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold text-white">
                      Version {release.version}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(release.type)}`}>
                      {release.type.charAt(0).toUpperCase() + release.type.slice(1)} Release
                    </span>
                  </div>
                  <span className="text-zinc-400 text-sm">
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Features */}
                {release.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                      <BsStars className="w-5 h-5" />
                      New Features
                    </h3>
                    <div className="space-y-3">
                      {release.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                          {feature.icon}
                          <div>
                            <h4 className="font-medium text-white">{feature.title}</h4>
                            <p className="text-zinc-400 text-sm mt-1">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bug Fixes */}
                {release.fixes && release.fixes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <MdBugReport className="w-5 h-5" />
                      Bug Fixes
                    </h3>
                    <div className="space-y-2">
                      {release.fixes.map((fix, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                          <BsBug className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-white">{fix.title}</h4>
                            <p className="text-zinc-400 text-sm mt-1">{fix.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Updates */}
                {release.security && release.security.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center gap-2">
                      <BsShield className="w-5 h-5" />
                      Security Updates
                    </h3>
                    <div className="space-y-2">
                      {release.security.map((security, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                          <BsShield className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-white">{security.title}</h4>
                            <p className="text-zinc-400 text-sm mt-1">{security.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800"
          >
            <p className="text-zinc-400">
              Have feedback or suggestions? Contact us at{' '}
              <a href="mailto:support@lightwell.ai" className="text-emerald-400 hover:text-emerald-300">
                support@lightwell.ai
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}