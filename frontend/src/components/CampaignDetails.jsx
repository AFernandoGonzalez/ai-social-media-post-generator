import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCampaigns } from "../contexts/CampaignsContext";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import { updateTopic, deleteTopic } from "../services/api";
import Modal from "./Modal";
import Pagination from "./Pagination";
import Button from "./Button";
import Filters from "./Filters";
import NoContentPlaceholder from './NoContentPlaceholder';


const CampaignDetails = () => {
  const { id } = useParams();
  const { campaigns, createTopic, loadCampaigns, loading } = useCampaigns();
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState(0);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicId, setEditTopicId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!campaigns.length) {
      loadCampaigns();
    }
  }, [campaigns.length, loadCampaigns]);

  const campaign = campaigns.find((c) => c._id === id);
  const sortedTopics = campaign?.topics.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalPages = campaign ? Math.ceil(sortedTopics.length / itemsPerPage) : 1;

  const filteredTopics = sortedTopics?.filter((topic) => {
    return (
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (dateFilter ? new Date(topic.createdAt) >= new Date(dateFilter) : true) &&
      (topicFilter ? topic.content.length >= parseInt(topicFilter) : true)
    );
  });

  const currentTopics = filteredTopics?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateTopic = async () => {
    if (newTopicTitle.trim()) {
      await createTopic(newTopicTitle, id);
      setNewTopicTitle("");
      loadCampaigns();
      toast.success(`Topic ${newTopicTitle} created!`);
    } else {
      toast.error("Topic title cannot be empty.");
    }
  };

  const handleUpdateTopic = async () => {
    if (editTopicTitle.trim() && selectedTopic) {
      await updateTopic(selectedTopic._id, editTopicTitle);
      setEditTopicId(null);
      setEditTopicTitle("");
      setSelectedTopic(null);
      setIsUpdateModalOpen(false);
      loadCampaigns();
      toast.success("Topic updated successfully");
    } else {
      toast.error("Topic title cannot be empty.");
    }
  };

  const handleDeleteTopic = async () => {
    if (selectedTopic) {
      await deleteTopic(selectedTopic._id);
      loadCampaigns();
      setIsDeleteModalOpen(false);
      toast.success("Topic deleted successfully");
    }
  };

  const openUpdateModal = (topic) => {
    setSelectedTopic(topic);
    setEditTopicTitle(topic.title);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (topic) => {
    setSelectedTopic(topic);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderMockTopics = () => {
    return (
      <NoContentPlaceholder
        height="md:h-[45vh]"
        icon="fas fa-tasks"
        title="You don't have any Topics"
        message="List of Topics you create will appear here."
        buttonText="Create a Topic"
        onClick={() => console.log('Create a Campaign')}
      />
    );
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
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row mb-4">
          <input
            type="text"
            value={newTopicTitle}
            required
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="New Topic Title"
            className="border p-2 rounded-lg flex-grow m-2"
          />
          <Button
            onClick={handleCreateTopic}
            variant="primary"
            className="rounded-r-md m-2"
          >
            Create Topic
          </Button>
        </div>
      </div>

      <Link
        to="/dashboard/campaigns"
        className="text-blue-500 hover:underline mt-6 inline-block"
      >
        Back to Campaigns
      </Link>

      <h2 className="text-3xl font-bold mb-4">
        {capitalizeFirstLetter(campaign.title)}
      </h2>

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        minTopics={campaign?.topics.length > 0 ? Math.min(...campaign.topics.map((t) => t.content.length)) : 0}
        maxTopics={campaign?.topics.length > 0 ? Math.max(...campaign.topics.map((t) => t.content.length)) : 20}
      />

      {currentTopics?.length === 0 ? (
        renderMockTopics()
      ) : (
        <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTopics?.map((topic) => (
                <Link
                  to={`/dashboard/topics/${topic._id}`}
                  key={topic._id}
                  className="group relative flex h-40 flex-col justify-end overflow-hidden p-6 transition-colors hover:bg-green-100 md:h-60 md:p-9 bg-white border border-gray-300 rounded-lg"
                >
                  <div className="absolute left-5 top-5 flex items-center gap-1.5 text-sm uppercase text-green-400 transition-colors duration-500 group-hover:text-gray-700">
                    <i className="fas fa-file-alt text-green-400"></i>
                  </div>
                  <h2 className="relative text-3xl leading-tight text-gray-800 transition-transform duration-500 group-hover:-translate-y-3">
                    {capitalizeFirstLetter(topic.title)}
                  </h2>
                  <div className="flex justify-between items-center mt-4">
                    <div className="left-3 top-5 flex items-center gap-1.5 text-xs uppercase text-gray-400 transition-colors duration-500 group-hover:text-gray-700">
                      <span>
                        Created: {new Date(topic.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openUpdateModal(topic);
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openDeleteModal(topic);
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
        </div>
      )}

      

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Topic"
        customHeight="50vh"
      >
        <input
          type="text"
          className="border p-2 rounded-md w-full mb-4"
          value={editTopicTitle}
          onChange={(e) => setEditTopicTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdateTopic}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          >
            Update
          </button>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        customHeight="50vh"
      >
        <p>Are you sure you want to delete this topic?</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDeleteTopic}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetails;
