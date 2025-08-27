import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const { error, provider } = router.query;

  useEffect(() => {
    // Redirect to signup with error parameter
    if (error) {
      router.push(`/signup?error=${error}${provider ? `&provider=${provider}` : ''}`);
    }
  }, [error, provider, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900/20 to-blue-900/20">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Authentication Error</h1>
            <p className="text-white/80 text-sm mb-6">
              There was a problem with your {provider || 'OAuth'} authentication.
              Redirecting you back to signup...
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              Return to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
