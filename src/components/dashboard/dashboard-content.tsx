'use client';

import { useEffect, useState } from 'react';
import { DashboardView } from './dashboard-view';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  averageSessionDuration: string;
}

const DashboardContent = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setTimeout(() => {
          const mockData: DashboardData = {
            totalUsers: 1500,
            activeUsers: 750,
            newUsersToday: 50,
            averageSessionDuration: '45 minutes',
          };
          setData(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-neonTeal-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6 bg-black/30 border border-red-500/50 rounded-lg">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-neonTeal-500/20 hover:bg-neonTeal-500/30 text-neonTeal-500 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <DashboardView />;
};

export default DashboardContent;
