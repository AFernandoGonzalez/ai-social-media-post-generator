import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';
import { capitalizeFirstLetter } from '../utils/stringCapitalizer';

const CampaignList = () => {
  const { campaigns, loadCampaigns } = useCampaigns();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState(0); 
  const itemsPerPage = 9;

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      return (
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (dateFilter ? new Date(campaign.createdAt) >= new Date(dateFilter) : true) &&
        (topicFilter ? campaign.topics.length >= parseInt(topicFilter) : true)
      );
    });

  const currentCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const minTopics = campaigns.length > 0 ? Math.min(...campaigns.map(campaign => campaign.topics.length)) : 0;
  const maxTopics = campaigns.length > 0 ? Math.max(...campaigns.map(campaign => campaign.topics.length)) : 0;

  return (
    <div className="min-h-full bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Campaigns</h2>
      <div className="mb-4 flex flex-col md:flex-row md:flex-wrap gap-4">
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="text-sm text-gray-600">Search by Campaign title:</label>
          <input
            type="text"
            placeholder="Search by Campaign Title"
            className="border p-2 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/4 flex flex-col">
          <label className="text-sm text-gray-600">Filter by date:</label>
          <input
            type="date"
            placeholder="Filter by date"
            className="border p-2 rounded-md w-full"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="text-sm text-gray-600">Filter by number of topics:</label>
          <input
            type="range"
            min={minTopics}
            max={maxTopics}
            className="border p-2 rounded-md"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          />
          <span className="text-sm text-gray-600">Selected: {topicFilter} topics</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentCampaigns.map(campaign => (
          <Link
            key={campaign._id}
            to={`/dashboard/campaigns/${campaign._id}`}
            className="group relative flex h-40 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-blue-100 md:h-60 md:p-9 bg-white border border-gray-300 rounded-lg"
          >
            <div className="absolute left-5 top-5 flex items-center gap-1.5 text-sm uppercase text-blue-400 transition-colors duration-500 group-hover:text-gray-700">
              <i className="fas fa-bullhorn text-blue-400"></i>
            </div>

            <h2 className="relative text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
              {capitalizeFirstLetter(campaign.title)}
            </h2>
            <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>

            <div className="flex justify-between items-center mt-4">
              <div className="left-3 top-5 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
                <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
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
            </div>
          </Link>
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
