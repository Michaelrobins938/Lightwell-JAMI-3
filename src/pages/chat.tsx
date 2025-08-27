import React from 'react';
import Head from 'next/head';
import AppShell from '../components/chat/AppShell';
import { NextPageWithLayout } from './_app';

const ChatPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Lightwell Chat</title>
        <meta name="description" content="AI-powered chat interface" />
      </Head>
      <AppShell />
    </>
  );
};

// No special layout needed as AppShell handles the entire page structure
ChatPage.getLayout = (page) => page;

export default ChatPage;