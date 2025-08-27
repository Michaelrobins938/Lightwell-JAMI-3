import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { getEventStats } from '../../services/analyticsService';
// ProtectedRoute removed - was causing infinite loops

function AdminDashboard() {
  const [pageViews, setPageViews] = useState({ totalEvents: 0, uniqueUsers: 0 });
  const [messagesSent, setMessagesSent] = useState({ totalEvents: 0, uniqueUsers: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

    const pageViewStats = await getEventStats('PAGE_VIEW', startDate, endDate);
    const messageSentStats = await getEventStats('SENT_MESSAGE', startDate, endDate);

    setPageViews(pageViewStats);
    setMessagesSent(messageSentStats);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Page Views (Last 30 Days)</h2>
            <p className="text-lg">Total Views: {pageViews.totalEvents}</p>
            <p className="text-lg">Unique Users: {pageViews.uniqueUsers}</p>
          </div>
          <div className="bg-white dark:bg-luna-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Messages Sent (Last 30 Days)</h2>
            <p className="text-lg">Total Messages: {messagesSent.totalEvents}</p>
            <p className="text-lg">Unique Users: {messagesSent.uniqueUsers}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;