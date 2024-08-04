import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCampaignById, createTopic } from '../services/api';
import { toast } from 'react-toastify';

const CampaignDetails = ({ campaignId }) => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    useEffect(() => {
        loadCampaign();
    }, [id]);

    const loadCampaign = async () => {
        try {
            const data = await getCampaignById(id);
            setCampaign(data);
        } catch (error) {
            console.error('Failed to load campaign', error);
            toast.error('Failed to load campaign');
        }
    };

    const handleCreateTopic = async () => {
        try {
            await createTopic(newTopicTitle, id);
            setNewTopicTitle('');
            loadCampaign();
        } catch (error) {
            console.error('Failed to create topic', error);
            toast.error('Failed to create topic');
        }
    };

    if (!campaign) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-lg font-semibold">Loading...</div>
        </div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
                        <button
                            onClick={handleCreateTopic}
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                        >
                            Create Topic
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaign.topics.map(topic => (
                        <div key={topic._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">{topic.title.toUpperCase()}</h3>
                            <Link
                                to={`/dashboard/topics/${topic._id}`}
                                className="text-blue-500 hover:underline"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
                <Link
                    to="/campaigns"
                    className="text-blue-500 hover:underline mt-6 inline-block"
                >
                    Back to Campaigns
                </Link>
            </div>
        </div>
    );
};

export default CampaignDetails;
