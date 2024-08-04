import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Total Campaigns</h2>
            <p className="text-3xl font-semibold text-gray-700">{campaigns.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Total Topics</h2>
            <p className="text-3xl font-semibold text-gray-700">{topics.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Campaign</h2>
            <Link to="/dashboard/campaigns" className="w-full bg-blue-500 text-white py-2 rounded text-center">
              Create Campaign
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Campaigns</h2>
            <Link to="/dashboard/campaigns" className="text-blue-500 hover:underline">
              View all campaigns
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <div key={campaign._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{campaign.title}</h3>
                <p className="text-gray-600 mb-2">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                <Link to={`/dashboard/campaigns/${campaign._id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Topics</h2>
            <Link to="/dashboard/topics" className="text-blue-500 hover:underline">
              View all topics
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topics.slice(0, 4).map((topic) => (
              <div key={topic._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{topic.title}</h3>
                <Link to={`/dashboard/topics/${topic._id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
