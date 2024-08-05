import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { capitalizeFirstLetter } from '../utils/stringCapitalizer';

const CampaignDetails = () => {
  const { id } = useParams();
  const { campaigns, createTopic, loadCampaigns, loading } = useCampaigns();
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!campaigns.length) {
      loadCampaigns();
    }
  }, [campaigns.length, loadCampaigns]);

  const campaign = campaigns.find(c => c._id === id);
  const totalPages = campaign ? Math.ceil(campaign.topics.length / itemsPerPage) : 1;

  const filteredTopics = campaign?.topics.filter(topic => {
    const meetsSearchCriteria = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const meetsDateCriteria = dateFilter ? new Date(topic.createdAt) >= new Date(dateFilter) : true;
    const meetsTopicCriteria = topicFilter ? topic.content.length >= parseInt(topicFilter) : true;
    return meetsSearchCriteria && meetsDateCriteria && meetsTopicCriteria;
  });

  const currentTopics = filteredTopics?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateTopic = async () => {
    if (newTopicTitle.trim()) {
      await createTopic(newTopicTitle, id);
      setNewTopicTitle('');
      loadCampaigns();
      toast.success(`Topic ${newTopicTitle} created!`);
    } else {
      toast.error('Topic title cannot be empty.');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Campaign not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex mb-4">
          <input
            type="text"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="New Topic Title"
            className="border p-2 rounded-l-md flex-grow"
          />
          <button
            onClick={handleCreateTopic}
            className="bg-blue-500 rounded-r-md text-white px-4 py-2 hover:bg-blue-600"
          >
            Create Topic
          </button>
        </div>
      </div>
      <Link
        to="/dashboard/campaigns"
        className="text-blue-500 hover:underline mt-6 inline-block"
      >
        Back to Campaigns
      </Link>
      
      <h2 className="text-3xl font-bold mb-4">{campaign.title}</h2>
      <div className="mb-4 flex flex-col md:flex-row md:flex-wrap gap-4">
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="text-sm text-gray-600">Search by topic title:</label>
          <input
            type="text"
            placeholder="Search by topic title"
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
            min={campaign?.topics.length > 0 ? Math.min(...campaign.topics.map(t => t.content.length)) : 0}
            max={campaign?.topics.length > 0 ? Math.max(...campaign.topics.map(t => t.content.length)) : 20}
            className="border p-2 rounded-md"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          />
          <span className="text-sm text-gray-600">Selected: {topicFilter} topics</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTopics?.map(topic => (
          <Link
            key={topic._id}
            to={`/dashboard/topics/${topic._id}`}
            className="group relative flex h-40 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-green-100 md:h-60 md:p-9 bg-white border border-gray-300 rounded-lg"
          >
            <div className="absolute left-5 top-5 flex items-center gap-1.5 text-sm uppercase text-green-400 transition-colors duration-500 group-hover:text-gray-700">
              <i className="fas fa-file-alt text-green-400"></i>
            </div>
            <h2 className="relative text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
              {capitalizeFirstLetter(topic.title)}
            </h2>
            <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <div className="flex justify-between items-center mt-4">
              <div className="left-3 top-5 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
                <span>Created: {new Date(topic.createdAt).toLocaleDateString()}</span>
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

export default CampaignDetails;
