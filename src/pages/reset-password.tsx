import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../components/layout/Layout';
import Button from '../components/Button';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Password reset failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Reset Password</h1>
        {success ? (
          <p className="text-green-500">Password reset successful. Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-luna-800 rounded-lg p-8 shadow-lg">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-luna-700 dark:text-luna-200 mb-1">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-luna-300 dark:border-luna-600 rounded-md focus:outline-none focus:ring-2 focus:ring-luna-500 dark:bg-luna-700 dark:text-luna-100"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-luna-700 dark:text-luna-200 mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-luna-300 dark:border-luna-600 rounded-md focus:outline-none focus:ring-2 focus:ring-luna-500 dark:bg-luna-700 dark:text-luna-100"
                required
              />
            </div>
            <Button type="submit" className="w-full">Reset Password</Button>
          </form>
        )}
      </div>
    </Layout>
  );
}