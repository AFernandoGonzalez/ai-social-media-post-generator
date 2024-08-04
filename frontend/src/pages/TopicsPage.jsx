import React from 'react';
import { useParams } from 'react-router-dom';
import CampaignDetails from '../components/CampaignDetails';

const TopicsPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Topics Page</h1>
      <CampaignDetails campaignId={id} />
    </div>
  );
};

export default TopicsPage;
