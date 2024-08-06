import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCampaigns } from '../services/api';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../utils/stringCapitalizer';
import Button from '../components/Button';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      const sortedCampaigns = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCampaigns(sortedCampaigns);
      const allTopics = sortedCampaigns.reduce((acc, campaign) => acc.concat(campaign.topics), []);
      const sortedTopics = allTopics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTopics(sortedTopics);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  const handleButtonClick = () => {
    navigate('/dashboard/campaigns');
  };

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
              onClick={handleButtonClick}
              variant="primary"
              className="rounded-r-md"
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
              <Link
                key={campaign._id}
                to={`/dashboard/campaigns/${campaign._id}`}
                className="group relative flex h-40 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-blue-100 md:h-60 md:p-9 bg-white border border-gray-300 rounded-lg"
              >
                <div className="absolute left-5 top-5 flex items-center gap-1.5 text-sm uppercase text-blue-400 transition-colors duration-500 group-hover:text-gray-700">
                  <i className="fas fa-bullhorn text-blue-400"></i>
                </div>

                <h2 className="relative text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
                  {capitalizeFirstLetter(campaign.title)}
                </h2>
                <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>

                <div className="flex justify-between items-center mt-4">
                  <div className=" left-3 top-5 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
                    <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
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
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Topics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.slice(0, 4).map((topic) => (
              <Link
                key={topic._id}
                to={`/dashboard/topics/${topic._id}`}
                className="group relative flex h-40 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-green-100 md:h-60 md:p-9 bg-white border border-gray-300 rounded-lg"
              >
                <div className="absolute left-5 top-5 flex items-center gap-1.5 text-sm uppercase text-green-400 transition-colors duration-500 group-hover:text-gray-700">
                  <i className="fas fa-file-alt text-green-400"></i>
                </div>
                <h2 className="relative text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
                  {capitalizeFirstLetter(topic.title)}
                </h2>
                <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="left-3 top-5 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
                    <span>Created: {new Date(topic.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
