import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../services/api';

const Sidebar = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const data = await getCampaigns();
    setCampaigns(data);
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
        {campaigns.map(campaign => (
          <div key={campaign._id} className="mb-4">
            <Link to={`/campaigns/${campaign._id}`} className="block text-lg font-semibold mb-2 hover:underline">
              {campaign.title}
            </Link>
            <ul className="ml-4">
              {campaign.topics.map(topic => (
                <li key={topic._id} className="mb-2">
                  <Link to={`/topics/${topic._id}`} className="hover:underline">
                    {topic.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
