import React from 'react';
import Head from 'next/head';
import HomepageSidebar from '../components/HomepageSidebar';
import HomepageHeader from '../components/HomepageHeader';
import HomepageFooter from '../components/HomepageFooter';
import HomepageChatBox from '../components/HomepageChatBox';
import HomepageCommunitySection from '../components/HomepageCommunitySection';

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Lightwell - AI-Powered Mental Health Support</title>
        <meta name="description" content="Experience JAMI-3, our advanced AI therapy assistant. Get personalized mental health support, join our community, and start your wellness journey." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-purple-950 text-gray-100">
        {/* Sidebar (desktop only) */}
        <HomepageSidebar />

        {/* Main Content */}
        <div className="md:ml-64 flex-1 flex flex-col">
          {/* Header with mobile sidebar toggle */}
          <HomepageHeader />

          {/* Scrollable main body */}
          <main className="flex-1 flex flex-col items-center p-8 space-y-12">
            {/* Hero Chat Demo */}
            <div className="card-glass-elevated-dark w-full max-w-4xl p-8">
              <HomepageChatBox />
            </div>

            {/* Community Preview */}
            <div className="card-glass-elevated-dark w-full max-w-6xl p-10">
              <HomepageCommunitySection />
            </div>
          </main>

          {/* Footer */}
          <HomepageFooter />
        </div>
      </div>
    </>
  );
}