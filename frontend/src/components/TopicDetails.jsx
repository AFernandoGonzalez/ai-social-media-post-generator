import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getTopicById,
  generateContent,
  saveContent,
  updateContent,
  deleteContent,
} from "../services/api";
import GenerateContentModal from "./GenerateContentModal";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import Button from "./Button";
import Loading from "./Loading";
import Modal from "./Modal";
import Pagination from "./Pagination";
import { motion } from "framer-motion";
import NoContentPlaceholder from "./NoContentPlaceholder";
import { useTheme } from '../contexts/ThemeContext';

const platformColors = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  linkedin: "#0077B5",
  youtube: "#FF0000",
  tiktok: "#000000",
  pinterest: "#E60023",
};

const platformIcons = {
  instagram: "fab fa-instagram",
  facebook: "fab fa-facebook-f",
  twitter: "fab fa-twitter",
  linkedin: "fab fa-linkedin-in",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
  pinterest: "fab fa-pinterest-p",
};

const TopicDetails = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [newContentText, setNewContentText] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadTopic();
  }, [id]);

  const loadTopic = async () => {
    try {
      const data = await getTopicById(id);
      setTopic(data);
    } catch (error) {
      console.error("Failed to load topic", error);
    }
  };

  const handleGenerateContent = async (
    platform,
    type,
    tone,
    style,
    mediaUrl
  ) => {
    const text = await generateContent(
      id,
      platform,
      type,
      tone,
      style,
      mediaUrl
    );
    return text;
  };

  const handleSaveContent = async (platform, type, text) => {
    await saveContent(id, { platform, type, text });
    loadTopic();
  };

  const handleUpdateContent = async () => {
    if (selectedContent && newContentText.trim()) {
      await updateContent(selectedContent._id, newContentText);
      loadTopic();
      setIsUpdateModalOpen(false);
      toast.success("Content updated successfully");
    } else {
      toast.error("Content text cannot be empty.");
    }
  };

  const handleDeleteContent = async () => {
    if (selectedContent) {
      await deleteContent(selectedContent._id);
      loadTopic();
      setIsDeleteModalOpen(false);
      toast.success("Content deleted successfully");
    }
  };

  const openUpdateModal = (content) => {
    setSelectedContent(content);
    setNewContentText(content.text);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (content) => {
    setSelectedContent(content);
    setIsDeleteModalOpen(true);
  };

  const getUniqueValues = (key) => {
    return [
      ...new Set(topic?.content.map((content) => content[key].toLowerCase())),
    ];
  };

  const uniqueTypes = getUniqueValues("type");
  const uniquePlatforms = getUniqueValues("platform");

  const filteredContent = topic?.content.filter(
    (content) =>
      (filterType
        ? content.type.toLowerCase() === filterType.toLowerCase()
        : true) &&
      (filterPlatform
        ? content.platform.toLowerCase() === filterPlatform.toLowerCase()
        : true)
  );

  const paginatedContent = filteredContent?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Text copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy text");
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const bounceTransition = {
    y: {
      duration: 0.4,
      ease: "easeOut",
    },
    times: [0, 0.2, 0.5, 0.7, 1],
    repeat: 3,
  };

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOptionClick = (action, content) => {
    action(content);
    setDropdownOpen(null);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  if (!topic) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  const renderMockContent = () => {
    return (
      <NoContentPlaceholder
        height="md:h-[70vh]"
        icon="fas fa-tasks"
        title="You don't have any Content"
        message="List of Content you create will appear here."

      />
    );
  };

  return (
    <div className={`min-h-full p-6 ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}>
      <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
  <div className="relative group w-full md:w-auto">
    <h2 className="text-xl md:text-3xl font-bold flex items-center">
      Topic: {capitalizeFirstLetter(topic.title)}
      <div className="relative ml-2">
        <motion.i
          className="fas fa-question-circle text-purple-500 text-2xl cursor-pointer"
          animate={{ y: ["20%", "-60%"] }}
          transition={bounceTransition}
        ></motion.i>
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} text-xs p-2 rounded shadow-lg z-20`}>
          This topic will be used to create content for any social media
          platform. If you like to create new content, you can update
          the topic title or create a new topic.
        </div>
      </div>
    </h2>
  </div>

  <Button
    onClick={() => setShowGenerateModal(true)}
    variant="primary"
    className="px-4 py-2 rounded-md w-full md:w-auto"
  >
    Generate Content
  </Button>
</div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-grow">
            <label className="block text-sm font-medium">
              Filter by Type
            </label>
            <div className="relative mt-1">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} block appearance-none w-full border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline`}
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type?.slice(1)}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium">
              Filter by Platform
            </label>
            <div className="relative mt-1">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} block appearance-none w-full border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline`}
              >
                <option value="">All Platforms</option>
                {uniquePlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform?.slice(1)}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        {paginatedContent?.length === 0 ? (
          renderMockContent()
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedContent.map((content) => (
                <div
                  key={content._id}
                  className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} p-4 rounded-lg shadow-md flex flex-col justify-between h-48 relative`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <i
                          className={`${platformIcons[content.platform.toLowerCase()]
                            } mr-2 text-3xl`}
                          style={{
                            color:
                              platformColors[content.platform.toLowerCase()],
                          }}
                        ></i>
                        <h4 className="font-bold text-lg">{content.type}</h4>
                      </div>
                      <button
                        onClick={() => handleDropdownToggle(content._id)}
                        className={`relative z-10 p-2 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} hover:${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'} focus:outline-none`}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                    <p className="text-sm line-clamp-3 overflow-hidden">
                      {content.text}
                    </p>
                  </div>
                  {dropdownOpen === content._id && (
                    <motion.div
                      ref={dropdownRef}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className={`absolute inset-0 flex flex-col justify-center items-center p-4 rounded-lg shadow-lg z-20 ${isDarkMode ? 'bg-dark-surface bg-opacity-100' : 'bg-light-surface bg-opacity-100'}`}
                    >
                      <a
                        onClick={() =>
                          handleOptionClick(
                            () => handleCopy(content.text),
                            content
                          )
                        }
                        className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} hover:${isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'} cursor-pointer flex items-center mb-2`}
                      >
                        <i className="fas fa-copy mr-2"></i> Copy
                      </a>
                      <a
                        onClick={() =>
                          handleOptionClick(
                            () => openUpdateModal(content),
                            content
                          )
                        }
                        className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} hover:${isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'} cursor-pointer flex items-center mb-2`}
                      >
                        <i className="fas fa-edit mr-2"></i> Edit
                      </a>
                      <a
                        onClick={() =>
                          handleOptionClick(
                            () => openDeleteModal(content),
                            content
                          )
                        }
                        className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} hover:${isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'} cursor-pointer flex items-center`}
                      >
                        <i className="fas fa-trash mr-2"></i> Delete
                      </a>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredContent.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      {showGenerateModal && (
        <GenerateContentModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateContent}
          onSave={handleSaveContent}
          topicTitle={topic.title}
        />
      )}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Content"
        customHeight="80vh"
      >
        <textarea
          className={`border p-2 rounded-md w-full h-[80%] mb-4 ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} border ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}
          value={newContentText}
          onChange={(e) => setNewContentText(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdateContent}
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
      >
        <div className="flex flex-col justify-center items-center gap-4 mt-4 h-full">
          <i className="fas fa-question-circle text-yellow-500 text-4xl"></i>
          <p className={`${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'} text-center text-lg`}>
            Are you sure you want to delete this content?
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleDeleteContent}
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 flex items-center justify-center"
            >
              <i className="fas fa-trash mr-2"></i> Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className={`${isDarkMode ? 'bg-dark-muted text-dark-textPrimary hover:bg-dark-hover' : 'bg-light-muted text-light-textPrimary hover:bg-light-hover'} px-6 py-3 rounded-md flex items-center justify-center`}
            >
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TopicDetails;
