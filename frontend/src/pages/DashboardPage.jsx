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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Campaign Summary</h2>
        <p>Total Campaigns: {campaigns.length}</p>
        <p>Total Topics: {topics.length}</p>
        {/* Add more summary data as needed */}
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Recent Campaigns</h2>
        <ul>
          {campaigns.slice(0, 5).map((campaign) => (
            <li key={campaign._id}>
              {campaign.title} - {new Date(campaign.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
