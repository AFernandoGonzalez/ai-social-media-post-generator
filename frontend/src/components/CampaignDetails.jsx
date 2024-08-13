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
import { useTheme } from '../contexts/ThemeContext';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const itemsPerPage = 6;
  const { isDarkMode } = useTheme();

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
      setIsCreateModalOpen(false);
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

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
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
        onClick={openCreateModal}
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
        <p className={`${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>Topic not found</p>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen flex flex-col justify-between ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}>

      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Campaigns</h1>
          <Button
            onClick={openCreateModal}
            variant="primary"
            className="py-2 px-4 sm:px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Create Topic
          </Button>
        </div>


        <Link
          to="/dashboard/campaigns"
          className="text-main-accent hover:underline mt-6 inline-block"
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
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTopics?.map((topic) => (
                <Link
                  to={`/dashboard/topics/${topic._id}`}
                  key={topic._id}
                  className={`group relative flex flex-col justify-end overflow-hidden p-4 sm:p-6 transition-colors hover:bg-main-accent min-h-[10rem] sm:min-h-[15rem] md:h-60 border rounded-lg ${isDarkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'}`}
                >
                  <div className={`absolute left-3 sm:left-5 top-3 sm:top-5 flex items-center gap-1.5 text-xs sm:text-sm uppercase text-main-accent transition-colors duration-500 group-hover:text-light-textPrimary`}>
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h2 className="relative text-lg sm:text-2xl md:text-3xl leading-tight transition-transform duration-500 group-hover:-translate-y-3">
                    {capitalizeFirstLetter(topic.title)}
                  </h2>
                  <div className="flex justify-between items-center mt-2 sm:mt-4">
                    <div className={`flex items-center gap-1.5 text-xs uppercase ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} transition-colors duration-500 group-hover:text-light-textPrimary`}>
                      <span>
                        Created: {new Date(topic.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openUpdateModal(topic);
                        }}
                        className={`${isDarkMode ? 'text-dark-textTertiary hover:text-dark-textPrimary' : 'text-light-textSecondary hover:text-light-textPrimary'} underline`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openDeleteModal(topic);
                        }}
                        className={`${isDarkMode ? 'text-dark-textTertiary hover:text-dark-textPrimary' : 'text-light-textSecondary hover:text-light-textPrimary'} underline`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Link>

              ))}
            </div>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Topic Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Topic"
        customHeight="50vh"
      >
        <input
          type="text"
          className={`border p-2 rounded-md w-full mb-4 ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} border ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}
          value={newTopicTitle}
          onChange={(e) => setNewTopicTitle(e.target.value)}
          placeholder="Topic Title"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCreateTopic}
            className="bg-main-accent text-white px-4 py-2 rounded-md hover:bg-main-accent-dark w-full"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className={`${isDarkMode ? 'bg-dark-muted text-dark-textPrimary hover:bg-dark-hover' : 'bg-light-muted text-light-textPrimary hover:bg-light-hover'} px-4 py-2 rounded-md w-full`}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Topic"
        customHeight="50vh"
      >
        <input
          type="text"
          className={`border p-2 rounded-md w-full mb-4 ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} border ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}
          value={editTopicTitle}
          onChange={(e) => setEditTopicTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdateTopic}
            className="bg-main-accent text-white px-4 py-2 rounded-md hover:bg-main-accent-dark w-full"
          >
            Update
          </button>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className={`${isDarkMode ? 'bg-dark-muted text-dark-textPrimary hover:bg-dark-hover' : 'bg-light-muted text-light-textPrimary hover:bg-light-hover'} px-4 py-2 rounded-md w-full`}
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
        <p className={`${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>
          Are you sure you want to delete this topic?
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDeleteTopic}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className={`${isDarkMode ? 'bg-dark-muted text-dark-textPrimary hover:bg-dark-hover' : 'bg-light-muted text-light-textPrimary hover:bg-light-hover'} px-4 py-2 rounded-md w-full`}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>

  );
};

export default CampaignDetails;
