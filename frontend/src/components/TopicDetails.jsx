import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTopicById, generateContent, saveContent, updateContent, deleteContent } from '../services/api';
import GenerateContentModal from './GenerateContentModal';
import { capitalizeFirstLetter } from '../utils/stringCapitalizer';
import Button from './Button';
import Loading from './Loading';
import Modal from './Modal';
import Pagination from './Pagination';
import { motion } from 'framer-motion';

const platformColors = {
    instagram: '#E1306C',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    youtube: '#FF0000',
    tiktok: '#000000',
    pinterest: '#E60023',
};

const platformIcons = {
    instagram: 'fab fa-instagram',
    facebook: 'fab fa-facebook-f',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin-in',
    youtube: 'fab fa-youtube',
    tiktok: 'fab fa-tiktok',
    pinterest: 'fab fa-pinterest-p',
};

const TopicDetails = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [newContentText, setNewContentText] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        loadTopic();
    }, [id]);

    const loadTopic = async () => {
        try {
            const data = await getTopicById(id);
            setTopic(data);
        } catch (error) {
            console.error('Failed to load topic', error);
        }
    };

    const handleGenerateContent = async (platform, type, tone, style, mediaUrl) => {
        const text = await generateContent(id, platform, type, tone, style, mediaUrl);
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
            toast.success('Content updated successfully');
        } else {
            toast.error('Content text cannot be empty.');
        }
    };

    const handleDeleteContent = async () => {
        if (selectedContent) {
            await deleteContent(selectedContent._id);
            loadTopic();
            setIsDeleteModalOpen(false);
            toast.success('Content deleted successfully');
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
        return [...new Set(topic?.content.map(content => content[key].toLowerCase()))];
    };

    const uniqueTypes = getUniqueValues('type');
    const uniquePlatforms = getUniqueValues('platform');

    const filteredContent = topic?.content.filter(content =>
        (filterType ? content.type.toLowerCase() === filterType.toLowerCase() : true) &&
        (filterPlatform ? content.platform.toLowerCase() === filterPlatform.toLowerCase() : true)
    );

    const paginatedContent = filteredContent?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success('Text copied to clipboard');
            })
            .catch(() => {
                toast.error('Failed to copy text');
            });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const bounceTransition = {
        y: {
            duration: 0.4,
            ease: 'easeOut',
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
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
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

    return (
        <div className="min-h-full p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative group">
                        <h2 className="md:text-3xl font-bold text-gray-800 flex items-center">
                            Topic: {capitalizeFirstLetter(topic.title)}
                            <div className="relative ml-2">
                                <motion.i
                                    className="fas fa-question-circle text-purple-500 text-2xl cursor-pointer"
                                    animate={{ y: ["20%", "-60%"] }}
                                    transition={bounceTransition}
                                ></motion.i>
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-100 text-gray-700 text-xs p-2 rounded shadow-lg z-20">
                                    This topic will be used to create content for any social media platform. If you like to create new content, you can update the topic title or create a new topic.
                                </div>
                            </div>
                        </h2>
                    </div>

                    <Button
                        onClick={() => setShowGenerateModal(true)}
                        variant="primary"
                        className="px-4 py-2 rounded-md"
                    >
                        Generate Content
                    </Button>
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">Filter by Type</label>
                        <div className="relative mt-1">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">All Types</option>
                                {uniqueTypes.map(type => (
                                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type?.slice(1)}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">Filter by Platform</label>
                        <div className="relative mt-1">
                            <select
                                value={filterPlatform}
                                onChange={(e) => setFilterPlatform(e.target.value)}
                                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">All Platforms</option>
                                {uniquePlatforms.map(platform => (
                                    <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform?.slice(1)}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
                {paginatedContent.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedContent.map(content => (
                                <div key={content._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-48 relative">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <i className={`${platformIcons[content.platform.toLowerCase()]} mr-2 text-3xl`} style={{ color: platformColors[content.platform.toLowerCase()] }}></i>
                                                <h4 className="font-bold text-lg">{content.type}</h4>
                                            </div>
                                            <button
                                                onClick={() => handleDropdownToggle(content._id)}
                                                className="relative z-10 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-700 line-clamp-3 overflow-hidden">{content.text}</p>
                                    </div>
                                    {dropdownOpen === content._id && (
                                        <motion.div
                                            ref={dropdownRef}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={dropdownVariants}
                                            className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-20"
                                        >
                                            <a onClick={() => handleOptionClick(() => handleCopy(content.text), content)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center mb-2">
                                                <i className="fas fa-copy mr-2"></i> Copy
                                            </a>
                                            <a onClick={() => handleOptionClick(() => openUpdateModal(content), content)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center mb-2">
                                                <i className="fas fa-edit mr-2"></i> Edit
                                            </a>
                                            <a onClick={() => handleOptionClick(() => openDeleteModal(content), content)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center">
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
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-yellow-100 border border-yellow-300 rounded-lg p-6">
                        <i className="fas fa-exclamation-circle text-yellow-500 text-3xl mb-4"></i>
                        <h2 className="text-xl font-bold text-yellow-600 mb-2">No Content Available</h2>
                        <p className="text-gray-700 mb-4">Please generate new content to get started.</p>
                        <Button
                            onClick={() => setShowGenerateModal(true)}
                            variant="primary"
                            className="px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                        >
                            Generate Content
                        </Button>
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
            >
                <textarea
                    className="border p-2 rounded-md w-full h-[80%] mb-4"
                    value={newContentText}
                    onChange={(e) => setNewContentText(e.target.value)}
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleUpdateContent}
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
                <div className="flex flex-col justify-center items-center gap-4 mt-4 h-full">
                    <i className="fas fa-question-circle text-yellow-500 text-4xl"></i>
                    <p className="text-center text-lg text-gray-700">Are you sure you want to delete this content?</p>
                    <div className="flex gap-4 mt-4  ">
                        <button
                            onClick={handleDeleteContent}
                            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 flex items-center justify-center"
                        >
                            <i className="fas fa-trash mr-2"></i> Delete
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 flex items-center justify-center"
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
