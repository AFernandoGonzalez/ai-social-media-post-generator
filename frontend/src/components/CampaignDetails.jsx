import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCampaignById, createTopic } from '../services/api';

const CampaignDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    useEffect(() => {
        loadCampaign();
    }, [id]);

    const loadCampaign = async () => {
        const data = await getCampaignById(id);
        setCampaign(data);
    };

    const handleCreateTopic = async () => {
        await createTopic(newTopicTitle, id);
        setNewTopicTitle('');
        loadCampaign();
    };

    if (!campaign) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="New Topic Title"
                    className="border p-2 rounded mr-2"
                />
                <button onClick={handleCreateTopic} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Create Topic
                </button>
            </div>
            <ul className="list-disc list-inside">
                {campaign.topics.map(topic => (
                    <li key={topic._id}>
                        <Link to={`/topics/${topic._id}`} className="text-blue-500">
                            {topic.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/" className="text-blue-500 mt-4 inline-block">Back to Campaigns</Link>
        </div>
    );
};

export default CampaignDetails;
