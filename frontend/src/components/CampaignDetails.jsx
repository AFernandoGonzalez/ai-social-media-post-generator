import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export const CampaignDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/api/campaigns/${id}`)
            .then(response => response.json())
            .then(data => setCampaign(data))
            .catch(error => console.error('Error fetching campaign:', error));
    }, [id]);

    if (!campaign) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{campaign.title}</h2>
            <Link to={`/create-post/${campaign._id}`}>Create New Post</Link>
            <div>
                {campaign.posts.map(post => (
                    <div key={post._id} className="post mb-8 p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2 text-blue-600">{post.topic} - {post.platform}</h3>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
