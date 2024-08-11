import React from 'react';
import { useParams } from 'react-router-dom';
import CampaignDetails from '../components/CampaignDetails';

const TopicsPage = () => {
  const { id } = useParams();

  return (
    <div className="bg-gray-100 min-h-full">
      <div className=" mx-auto ">
        <CampaignDetails campaignId={id} />
      </div>
    </div>
  );
};

export default TopicsPage;
