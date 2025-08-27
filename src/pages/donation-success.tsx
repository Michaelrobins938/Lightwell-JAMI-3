import React from 'react';
import { Layout } from '../components/layout/Layout';
import Link from 'next/link';

const DonationSuccess: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8">Thank You for Your Donation!</h1>
        <p className="text-xl text-center mb-8">
          Your support means the world to us and helps us continue our mission of providing mental health support to those in need.
        </p>
        <div className="text-center">
          <Link href="/" className="text-luna-500 hover:text-luna-600 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default DonationSuccess;