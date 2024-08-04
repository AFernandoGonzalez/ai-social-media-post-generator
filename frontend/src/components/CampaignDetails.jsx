import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCampaigns } from '../contexts/CampaignsContext';
import { toast } from 'react-toastify';
import Button from './Button';

const CampaignDetails = () => {
  const { id } = useParams();
  const { campaigns, createTopic, loadCampaigns } = useCampaigns();
  const campaign = campaigns.find(c => c._id === id);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
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
          <div key={topic._id} className="bg-white p-3 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <i className="fas fa-file-alt text-gray-800 mr-2"></i>
                  <h3 className="text-xl font-semibold text-gray-800">{topic.title.toUpperCase()}</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Created:</span> {new Date(topic.createdAt).toLocaleDateString()}
              </p>
            </div>
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
          </div>
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
