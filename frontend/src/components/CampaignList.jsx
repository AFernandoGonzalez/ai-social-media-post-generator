import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';

const CampaignList = () => {
  const { campaigns } = useCampaigns();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
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
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {currentCampaigns.map(campaign => (
            <div key={campaign._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{campaign.title}</h3>
              <p className="text-gray-600 mb-2">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              <Link to={`/dashboard/campaigns/${campaign._id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CampaignList;
