import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicById, generateContent } from '../services/api';
import GenerateContentModal from './GenerateContentModal';

const TopicDetails = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
        await generateContent(id, platform, type, tone, style, mediaUrl);
        loadTopic();
    };

    const filteredContent = topic?.content.filter(content =>
        (filterType ? content.type === filterType : true) &&
        (filterPlatform ? content.platform === filterPlatform : true)
    );

    if (!topic) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
            <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>
            <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Generate Content
            </button>
            <div className="flex flex-col sm:flex-row mb-4">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border p-2 rounded mb-2 sm:mb-0 sm:mr-4"
                >
                    <option value="">Filter by Type</option>
                    <option value="Caption">Caption</option>
                    <option value="Hashtags">Hashtags</option>
                    <option value="Call-to-action">Call-to-action</option>
                    <option value="Text">Text</option>
                    <option value="Title">Title</option>
                    <option value="Description">Description</option>
                    <option value="Tags">Tags</option>
                    <option value="Thumbnail Suggestions">Thumbnail Suggestions</option>
                </select>
                <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Filter by Platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4">Type</th>
                            <th className="py-2 px-4">Platform</th>
                            <th className="py-2 px-4">Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContent.map(content => (
                            <tr key={content._id}>
                                <td className="border px-4 py-2">{content.type}</td>
                                <td className="border px-4 py-2">{content.platform}</td>
                                <td className="border px-4 py-2">{content.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <GenerateContentModal
                    onClose={() => setShowModal(false)}
                    onGenerate={handleGenerateContent}
                    topicTitle={topic.title}
                />
            )}
        </div>
    );
};

export default TopicDetails;
