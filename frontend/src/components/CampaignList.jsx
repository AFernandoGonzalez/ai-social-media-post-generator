import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../services/api';

const CampaignList = ({ refresh }) => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        loadCampaigns();
    }, [refresh]);

    const loadCampaigns = async () => {
        const data = await getCampaigns();
        setCampaigns(data);
    };

    if (!campaigns.length) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-lg font-semibold">Loading...</div>
        </div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-3xl font-bold mb-4">Campaigns</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => (
                        <div key={campaign._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                            <Link
                                to={`/campaigns/${campaign._id}`}
                                className="text-blue-500 hover:underline"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CampaignList;
