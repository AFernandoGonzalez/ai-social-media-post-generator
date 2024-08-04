import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/api';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
      const allTopics = data.reduce((acc, campaign) => acc.concat(campaign.topics), []);
      setTopics(allTopics);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign Summary</h2>
          <p className="text-gray-600">Total Campaigns: {campaigns.length}</p>
          <p className="text-gray-600">Total Topics: {topics.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Campaigns</h2>
          <ul className="space-y-4">
            {campaigns.slice(0, 5).map((campaign) => (
              <li key={campaign._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">{campaign.title}</h3>
                <p className="text-gray-600">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Topics</h2>
        <ul className="space-y-4">
          {topics.map((topic) => (
            <li key={topic._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
