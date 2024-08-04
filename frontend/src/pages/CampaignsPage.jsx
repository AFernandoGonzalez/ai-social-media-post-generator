import React, { useState } from 'react';
import CampaignList from '../components/CampaignList';
import { createCampaign } from '../services/api';

const CampaignsPage = () => {
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handleCreateCampaign = async () => {
    if (newCampaignTitle.trim()) {
      await createCampaign(newCampaignTitle);
      setNewCampaignTitle('');
      setRefresh(!refresh);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Campaigns Page</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newCampaignTitle}
          onChange={(e) => setNewCampaignTitle(e.target.value)}
          placeholder="New Campaign Title"
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleCreateCampaign} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Campaign
        </button>
      </div>
      <CampaignList refresh={refresh} />
    </div>
  );
};

export default CampaignsPage;
