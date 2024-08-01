import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { CreateCampaign } from './components/CreateCampaign';
import { CreatePost } from './components/CreatePost';
import { CampaignDetails } from './components/CampaignDetails';

function App() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/campaigns')
      .then(response => response.json())
      .then(data => setCampaigns(data))
      .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  const handleCampaignCreate = (campaign) => {
    setCampaigns([...campaigns, campaign]);
  };

  return (

    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">AI Social Media Campaign Manager</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CreateCampaign onCreate={handleCampaignCreate} />
              <div>
                <h2>Saved Campaigns:</h2>
                {campaigns.map(campaign => (
                  <div key={campaign._id} className="mb-4">
                    <Link to={`/campaigns/${campaign._id}`} className="text-blue-600">
                      {campaign.title}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          }
        />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/create-post/:campaignId" element={<CreatePost />} />
      </Routes>
    </div>
  );
}

export default App;
