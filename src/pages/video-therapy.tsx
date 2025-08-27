import React from 'react';
import type { ReactElement } from 'react';
import { UnifiedChatInterface } from '../components/chat/UnifiedChatInterface';
import { ChatLayout } from '../components/layout/ChatLayout';
import type { NextPageWithLayout } from './_app';

const VideoTherapy: NextPageWithLayout = () => {
  return (
    <UnifiedChatInterface
      userId="video-therapy-user"
    />
  );
};

// Use a custom layout that bypasses the default layout
VideoTherapy.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default VideoTherapy;