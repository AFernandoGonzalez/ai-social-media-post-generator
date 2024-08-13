import React, { useState, useEffect } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import { updateCampaign, deleteCampaign } from "../services/api";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Pagination from "./Pagination";
import Filters from "./Filters";
import NoContentPlaceholder from './NoContentPlaceholder';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';
import { toast } from 'react-toastify';

const CampaignList = () => {
  const { campaigns, createCampaign, loadCampaigns } = useCampaigns();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For Create Campaign Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const itemsPerPage = 9;
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (dateFilter
        ? new Date(campaign.createdAt) >= new Date(dateFilter)
        : true) &&
      (topicFilter ? campaign.topics.length >= parseInt(topicFilter) : true)
    );
  });

  const currentCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const minTopics =
    campaigns.length > 0
      ? Math.min(...campaigns.map((campaign) => campaign.topics.length))
      : 0;
  const maxTopics =
    campaigns.length > 0
      ? Math.max(...campaigns.map((campaign) => campaign.topics.length))
      : 0;

  const handleCreateCampaign = async () => {
    if (newCampaignTitle.trim()) {
      await createCampaign(newCampaignTitle);
      setNewCampaignTitle('');
      toast.success(`Campaign ${newCampaignTitle} created!`);
      setIsCreateModalOpen(false); // Close modal after creating campaign
    } else {
      toast.error('Campaign title cannot be empty.');
    }
  };

  const handleUpdateCampaign = async () => {
    try {
      await updateCampaign(selectedCampaign._id, newTitle);
      loadCampaigns();
      setIsUpdateModalOpen(false);
      setNewTitle("");
    } catch (error) {
      console.error("Error updating campaign:", error.message);
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      await deleteCampaign(selectedCampaign._id);
      loadCampaigns();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting campaign:", error.message);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (campaign) => {
    setSelectedCampaign(campaign);
    setNewTitle(campaign.title);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const renderMockCampaigns = () => {
    return (
      <NoContentPlaceholder
        height="md:h-[50vh]"
        icon="fas fa-tasks"
        title="You don't have any Campaigns"
        message="List of Campaigns you create will appear here."
        buttonText="Create a Campaign"
        onClick={openCreateModal}
      />
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'} min-h-full  rounded-lg  flex flex-col justify-between`}>
 

      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Campaigns</h1>
        <Button
          onClick={openCreateModal}
          variant="primary"
          className="py-2 px-4 sm:px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 w-full sm:w-auto"
        >
          Create Campaign
        </Button>
      </div>

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        minTopics={minTopics}
        maxTopics={maxTopics}
      />
      {currentCampaigns.length === 0 ? (
        renderMockCampaigns()
      ) : (
        <div className="md:min-h-[50vh] flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCampaigns.map((campaign) => (
              <Link
                key={campaign._id}
                to={`/dashboard/campaigns/${campaign._id}`}
                className={`relative group flex flex-col justify-end overflow-hidden p-4 sm:p-6 transition-colors ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} hover:bg-main-accent h-auto min-h-[10rem] sm:min-h-[15rem] md:h-60 rounded-lg border ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}
              >
                <div className={`absolute left-3 sm:left-5 top-3 sm:top-5 flex items-center gap-1.5 text-xs sm:text-sm uppercase text-main-accent transition-colors duration-500 group-hover:text-light-textPrimary`}>
                  <i className="fas fa-bullhorn"></i>
                </div>
                <h2 className="relative text-lg sm:text-2xl md:text-3xl leading-tight transition-transform duration-500 group-hover:-translate-y-3">
                  {capitalizeFirstLetter(campaign.title)}
                </h2>
                <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 filter mix-blend-multiply"></div>
                <div className="flex justify-between items-center mt-2 sm:mt-4">
                  <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} transition-colors duration-500 group-hover:text-light-textPrimary`}>
                    <span>
                      Created: {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {campaign.topics.slice(0, 3).map((topic) => (
                      <i
                        key={topic._id}
                        className={`fas fa-file-alt ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 ${isDarkMode ? 'border-dark-background' : 'border-light-background'} flex items-center justify-center`}
                      ></i>
                    ))}
                    {campaign.topics.length > 3 && (
                      <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 ${isDarkMode ? 'border-dark-background bg-dark-muted text-dark-textTertiary' : 'border-light-background bg-light-muted text-light-textTertiary'} text-xs flex items-center justify-center`}>
                        +{campaign.topics.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openUpdateModal(campaign);
                    }}
                    className={`${isDarkMode ? 'text-dark-textTertiary hover:text-dark-textPrimary' : 'text-light-textSecondary hover:text-light-textPrimary'} underline`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteModal(campaign);
                    }}
                    className={`${isDarkMode ? 'text-dark-textTertiary hover:text-dark-textPrimary' : 'text-light-textSecondary hover:text-light-textPrimary'} underline`}
                  >
                    Delete
                  </button>
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

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Campaign"
      >
        <input
          type="text"
          className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} border ${isDarkMode ? 'border-dark-border' : 'border-light-border'} p-2 rounded-md w-full mb-4`}
          value={newCampaignTitle}
          onChange={(e) => setNewCampaignTitle(e.target.value)}
          placeholder="Campaign Title"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCreateCampaign}
            className="bg-main-accent text-white px-4 py-2 rounded-md hover:bg-main-accent-dark w-full"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="bg-dark-muted text-dark-textPrimary px-4 py-2 rounded-md hover:bg-dark-hover w-full"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Campaign"
      >
        <input
          type="text"
          className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} border ${isDarkMode ? 'border-dark-border' : 'border-light-border'} p-2 rounded-md w-full mb-4`}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdateCampaign}
            className="bg-main-accent text-white px-4 py-2 rounded-md hover:bg-main-accent-dark w-full"
          >
            Update
          </button>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className="bg-dark-muted text-dark-textPrimary px-4 py-2 rounded-md hover:bg-dark-hover w-full"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <p className={`${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>
          Are you sure you want to delete this campaign?
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDeleteCampaign}
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

export default CampaignList;
