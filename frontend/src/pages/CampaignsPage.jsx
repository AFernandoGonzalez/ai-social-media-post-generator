import React, { useState } from 'react';
import CampaignList from '../components/CampaignList';
import { useTheme } from '../contexts/ThemeContext';

const CampaignsPage = () => {

  const { isDarkMode } = useTheme();

  

  return (
    <div className={`${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'} min-h-[100%]`}>
      <div className="container mx-auto p-6">
        <CampaignList isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default CampaignsPage;
