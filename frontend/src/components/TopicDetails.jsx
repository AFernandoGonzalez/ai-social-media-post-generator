import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTopicById, generateContent, saveContent } from '../services/api';
import GenerateContentModal from './GenerateContentModal';
// import ContentModal from './ContentModal';
import Button from './Button';
import Loading from './Loading';

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
    // const [showContentModal, setShowContentModal] = useState(false);
    // const [selectedContent, setSelectedContent] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('');

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

    const getUniqueValues = (key) => {
        return [...new Set(topic?.content.map(content => content[key].toLowerCase()))];
    };

    const uniqueTypes = getUniqueValues('type');
    const uniquePlatforms = getUniqueValues('platform');

    const filteredContent = topic?.content.filter(content =>
        (filterType ? content.type.toLowerCase() === filterType.toLowerCase() : true) &&
        (filterPlatform ? content.platform.toLowerCase() === filterPlatform.toLowerCase() : true)
    );


    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success('Text copied to clipboard');
            })
            .catch(() => {
                toast.error('Failed to copy text');
            });
    };

    if (!topic) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loading/>
            </div>
        );
    }

    return (
        <div className="min-h-full  p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Content for {topic.title.toUpperCase()}</h2>
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
                                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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
                                    <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
                {filteredContent.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContent.map(content => (
                            <div key={content._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-48">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <i className={`${platformIcons[content.platform.toLowerCase()]} mr-2 text-3xl`} style={{ color: platformColors[content.platform.toLowerCase()] }}></i>
                                            <h4 className="font-bold text-lg">{content.type}</h4>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-3 overflow-hidden">{content.text}</p>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <Button
                                        onClick={() => handleCopy(content.text)}
                                        variant="primary"
                                        className="px-4 py-2 rounded"
                                    >
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        ))}
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
            
        </div>
    );
};

export default TopicDetails;
