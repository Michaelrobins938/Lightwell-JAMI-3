import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get email from URL or localStorage
    const urlEmail = router.query.email as string;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');

    if (urlEmail) {
      setEmail(urlEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [router.query.email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Header */}
        <div className="mb-8">
          <Link href="/auth/signin" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>

          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400">We've sent a magic link to</p>
          {email && <p className="text-purple-400 font-medium mt-1">{email}</p>}
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-medium">Click the link in your email</p>
                <p className="text-gray-400 text-sm">It will sign you in automatically</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-medium">No password needed</p>
                <p className="text-gray-400 text-sm">Magic links are secure and convenient</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Link
              href="/auth/signin"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              Send another link
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-gray-400 hover:text-gray-300 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
