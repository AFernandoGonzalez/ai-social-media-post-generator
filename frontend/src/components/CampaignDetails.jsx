import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';
import { toast } from 'react-toastify';
import Button from './Button';
import Loading from './Loading';

const CampaignDetails = () => {
  const { id } = useParams();
  const { campaigns, createTopic, loadCampaigns, loading } = useCampaigns();
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!campaigns.length) {
      loadCampaigns();
    }
  }, [campaigns.length, loadCampaigns]);

  const campaign = campaigns.find(c => c._id === id);
  const totalPages = campaign ? Math.ceil(campaign.topics.length / itemsPerPage) : 1;

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

  const currentTopics = campaign.topics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Link
        to="/dashboard/campaigns"
        className="text-blue-500 hover:underline mt-6 inline-block"
      >
        Back to Campaigns
      </Link>
      <h2 className="text-3xl font-bold mb-4">{campaign.title}</h2>
      <div className="mb-6">
        <div className="flex mb-4">
          <input
            type="text"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="New Topic Title"
            className="border p-2 rounded-l-md flex-grow"
          />
          <Button onClick={handleCreateTopic} variant="primary" className="rounded-r-md">
            Create Topic
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTopics.map(topic => (
          <a 
            key={topic._id} 
            href={`/dashboard/topics/${topic._id}`} 
            className="group relative flex h-56 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-green-100 md:h-80 md:p-9 bg-white border border-gray-300 rounded-lg"
          >
            <div className="absolute left-3 top-5 z-10 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
              <i className="fas fa-file-alt text-gray-400"></i>
              <span>Created: {new Date(topic.createdAt).toLocaleDateString()}</span>
            </div>
            <h2 className="relative z-10 text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
              {topic.title.toUpperCase()}
            </h2>
            <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <div className="flex justify-between items-center mt-4">
              <Button
                as={Link}
                to={`/dashboard/topics/${topic._id}`}
                variant="primary"
                className="bg-black rounded text-white m-1 py-[2px] hover:bg-gray-800"
              >
                View Topic
              </Button>
            </div>
          </a>
        ))}
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

export default CampaignDetails;
