import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicById, generateContent, saveContent } from '../services/api';
import GenerateContentModal from './GenerateContentModal';
import ContentModal from './ContentModal';

const TopicDetails = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('');

    useEffect(() => {
        loadTopic();
    }, [id]);

    const loadTopic = async () => {
        const data = await getTopicById(id);
        setTopic(data);
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

    const openContentModal = (content) => {
        setSelectedContent(content);
        setShowContentModal(true);
    };

    if (!topic) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Content for {topic.title.toUpperCase()}</h2>
                <button onClick={() => setShowGenerateModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Generate Content
                </button>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Filter by Type</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Filter by Platform</label>
                    <select
                        value={filterPlatform}
                        onChange={(e) => setFilterPlatform(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">All Platforms</option>
                        {uniquePlatforms.map(platform => (
                            <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map(content => (
                    <div key={content._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-48">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-lg">{content.type} ({content.platform})</h4>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-3 overflow-hidden">{content.text}</p>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button onClick={() => openContentModal(content)} className="bg-blue-500 text-white px-4 py-2 rounded">More</button>
                        </div>
                    </div>
                ))}
            </div>
            {showGenerateModal && (
                <GenerateContentModal
                    onClose={() => setShowGenerateModal(false)}
                    onGenerate={handleGenerateContent}
                    onSave={handleSaveContent}
                    topicTitle={topic.title}
                />
            )}
            {showContentModal && (
                <ContentModal
                    content={selectedContent}
                    onClose={() => setShowContentModal(false)}
                />
            )}
        </div>
    );
};

export default TopicDetails;
