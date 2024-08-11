import React, { useState } from 'react';
import CampaignList from '../components/CampaignList';
import { useCampaigns } from '../contexts/CampaignsContext';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';

const CampaignsPage = () => {
  const { createCampaign } = useCampaigns();
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const { isDarkMode } = useTheme();

  const handleCreateCampaign = async () => {
    if (newCampaignTitle.trim()) {
      await createCampaign(newCampaignTitle);
      setNewCampaignTitle('');
      toast.success(`Campaign ${newCampaignTitle} created!`);
    } else {
      toast.error('Campaign title cannot be empty.');
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-[100%]`}>
      <div className="container mx-auto p-6">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md mb-6`}>
          <div className="flex flex-col md:flex-row mb-4">
            <input
              type="text"
              value={newCampaignTitle}
              required
              onChange={(e) => setNewCampaignTitle(e.target.value)}
              placeholder="New Campaign Title"
              className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border p-2 rounded-lg flex-grow m-2`}
            />
            <Button
              onClick={handleCreateCampaign}
              variant="primary"
              className="rounded-r-md m-2"
            >
              Create Campaign
            </Button>
          </div>
        </div>
        <CampaignList />
      </div>
    </div>
  );
};

export default CampaignsPage;
