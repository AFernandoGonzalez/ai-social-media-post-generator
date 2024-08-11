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

const CampaignList = () => {
  const { campaigns, loadCampaigns } = useCampaigns();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newTitle, setNewTitle] = useState("");
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
        onClick={() => console.log('Create a Campaign')}
      />
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-full p-6 rounded-lg shadow-md flex flex-col justify-between`}>
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
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
                className={`relative group flex h-40 flex-col justify-end overflow-hidden p-6 transition-colors ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} hover:bg-blue-100 md:h-60 md:p-9 border border-gray-300 rounded-lg`}
              >
                <div className={`absolute left-5 top-5 flex items-center gap-1.5 text-sm uppercase ${isDarkMode ? 'text-blue-300' : 'text-blue-400'} transition-colors duration-500 group-hover:text-gray-700`}>
                  <i className={`fas fa-bullhorn ${isDarkMode ? 'text-blue-300' : 'text-blue-400'}`}></i>
                </div>
                <h2 className="relative text-3xl leading-tight transition-transform duration-500 group-hover:-translate-y-3">
                  {capitalizeFirstLetter(campaign.title)}
                </h2>
                <div
                  className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all group-hover:opacity-10 group-active:scale-105 group-active:opacity-30 group-active:blur-0 group-active:grayscale-0"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="flex justify-between items-center mt-4">
                  <div className={`left-3 top-5 flex items-center gap-1.5 text-xs uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-400'} transition-colors duration-500 group-hover:text-gray-700`}>
                    <span>
                      Created:{" "}
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {campaign.topics.slice(0, 3).map((topic) => (
                      <i
                        key={topic._id}
                        className={`fas fa-file-alt ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} w-6 h-6 rounded-full border-2 border-white flex items-center justify-center`}
                      ></i>
                    ))}
                    {campaign.topics.length > 3 && (
                      <div className={`w-6 h-6 rounded-full border-2 border-white ${isDarkMode ? 'bg-gray-500 text-gray-300' : 'bg-gray-300 text-gray-700'} text-xs flex items-center justify-center`}>
                        +{campaign.topics.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openUpdateModal(campaign);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteModal(campaign);
                    }}
                    className="text-red-500 hover:underline"
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
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Campaign"
      >
        <input
          type="text"
          className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border p-2 rounded-md w-full mb-4`}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdateCampaign}
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
      >
        <p>Are you sure you want to delete this campaign?</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDeleteCampaign}
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

export default CampaignList;
