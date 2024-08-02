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

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
            <ul className="list-disc list-inside">
                {campaigns.map(campaign => (
                    <li key={campaign._id}>
                        <Link to={`/campaigns/${campaign._id}`} className="text-blue-500">
                            {campaign.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CampaignList;
