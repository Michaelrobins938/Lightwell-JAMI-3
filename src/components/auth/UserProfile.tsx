import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Crown } from 'lucide-react';
import Link from 'next/link';

interface UserProfileProps {
  compact?: boolean;
}

export default function UserProfile({ compact = false }: UserProfileProps) {
  const { data: session } = useSession();

  if (!session) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>

        <h3 className="text-white font-semibold text-lg mb-1">
          {session.user?.name || 'User'}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {session.user?.email}
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center gap-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
}
