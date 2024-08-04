import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../services/api';
import { toast } from 'react-toastify';
import Button from '../components/Button';

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
            <Button
              as={Link}
              to="/dashboard/campaigns"
              variant="primary"
              className="w-full py-2 text-center"
            >
              Create Campaign
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Campaigns</h2>
            <Link to="/dashboard/campaigns" className="text-blue-500 hover:underline">
              View all campaigns
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => (
              <div key={campaign._id} className="bg-white p-3 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <i className="fas fa-bullhorn text-gray-800 mr-2"></i>
                      <h3 className="text-xl font-semibold text-gray-800">{campaign.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Created:</span> {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex -space-x-2">
                    {campaign.topics.slice(0, 3).map((topic) => (
                      <i key={topic._id} className="fas fa-file-alt text-gray-800 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"></i>
                    ))}
                    {campaign.topics.length > 3 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 text-gray-700 text-xs flex items-center justify-center">
                        +{campaign.topics.length - 3}
                      </div>
                    )}
                  </div>
                  <Button
                    as={Link}
                    to={`/dashboard/campaigns/${campaign._id}`}
                    variant="primary"
                    className="bg-black rounded text-white m-1 py-[2px] hover:bg-gray-800"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Topics</h2>
            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.slice(0, 4).map((topic) => (
              <div key={topic._id} className="bg-white p-3 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <i className="fas fa-file-alt text-gray-800 mr-2"></i>
                      <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Created:</span> {new Date(topic.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    as={Link}
                    to={`/dashboard/topics/${topic._id}`}
                    variant="primary"
                    className="bg-black rounded text-white m-1 py-[2px] hover:bg-gray-800"
                  >
                    View Topic
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
