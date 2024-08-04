import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';
import Button from './Button';

const CampaignList = () => {
  const { campaigns, loadCampaigns } = useCampaigns();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const currentCampaigns = campaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-full bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCampaigns.map(campaign => (
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
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="default"
          className="rounded-l-lg"
        >
          Previous
        </Button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="default"
          className="rounded-r-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CampaignList;
