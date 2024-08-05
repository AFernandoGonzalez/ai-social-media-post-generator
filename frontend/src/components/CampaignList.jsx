import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

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
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Campaigns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCampaigns.map(campaign => (
          <div 
            key={campaign._id} 
            className="group relative flex h-56 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-blue-100 md:h-80 md:p-9 bg-white border border-gray-300 rounded-lg"
          >
            <div className="absolute left-3 top-5 z-10 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
              <i className="fas fa-bullhorn text-gray-400"></i>
              <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
            </div>
            <h2 className="relative z-10 text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
              {capitalizeFirstLetter(campaign.title)}
            </h2>
            <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
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
              <Link
                to={`/dashboard/campaigns/${campaign._id}`}
                className="bg-blue-500 rounded text-white m-1 py-[2px] px-3 hover:bg-green-700"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 rounded-l-lg px-4 py-2 hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 rounded-r-lg px-4 py-2 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CampaignList;
