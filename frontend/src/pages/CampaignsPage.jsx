import React, { useState } from 'react';
import CampaignList from '../components/CampaignList';
import { useCampaigns } from '../contexts/CampaignsContext';

const CampaignsPage = () => {
  const { createCampaign } = useCampaigns();
  const [newCampaignTitle, setNewCampaignTitle] = useState('');

  const handleCreateCampaign = async () => {
    if (newCampaignTitle.trim()) {
      await createCampaign(newCampaignTitle);
      setNewCampaignTitle('');
    }
  };

  return (
    <div className="bg-gray-100 min-h-[100%]">
      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex mb-4">
            <input
              type="text"
              value={newCampaignTitle}
              onChange={(e) => setNewCampaignTitle(e.target.value)}
              placeholder="New Campaign Title"
              className="border p-2 rounded-l-md flex-grow"
            />
            <button
              onClick={handleCreateCampaign}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
            >
              Create Campaign
            </button>
          </div>
        </div>
        <CampaignList />
      </div>
    </div>
  );
};

export default CampaignsPage;
