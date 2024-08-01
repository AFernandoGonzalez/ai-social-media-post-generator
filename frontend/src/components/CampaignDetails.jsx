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

    const renderPostContent = (content, platform) => {
        try {
            // Parse the JSON-like content string
            const parsedContent = JSON.parse(content);

            // Display the parsed content
            return (
                <div>
                    {parsedContent.caption && (
                        <div>
                            <strong>Caption:</strong>
                            <p>{parsedContent.caption}</p>
                        </div>
                    )}
                    {parsedContent.text && (
                        <div>
                            <strong>Text:</strong>
                            <p>{parsedContent.text}</p>
                        </div>
                    )}
                    {parsedContent.hashtags && (
                        <div>
                            <strong>Hashtags:</strong>
                            <p>{parsedContent.hashtags}</p>
                        </div>
                    )}
                    {parsedContent.callToAction && (
                        <div>
                            <strong>Call-to-Action:</strong>
                            <p>{parsedContent.callToAction}</p>
                        </div>
                    )}
                    {parsedContent.professionalHashtags && (
                        <div>
                            <strong>Professional Hashtags:</strong>
                            <p>{parsedContent.professionalHashtags}</p>
                        </div>
                    )}
                    {parsedContent.title && (
                        <div>
                            <strong>Title:</strong>
                            <p>{parsedContent.title}</p>
                        </div>
                    )}
                    {parsedContent.description && (
                        <div>
                            <strong>Description:</strong>
                            <p>{parsedContent.description}</p>
                        </div>
                    )}
                    {parsedContent.tags && (
                        <div>
                            <strong>Tags:</strong>
                            <p>{parsedContent.tags}</p>
                        </div>
                    )}
                    {parsedContent.thumbnailSuggestions && (
                        <div>
                            <strong>Thumbnail Suggestions:</strong>
                            <p>{parsedContent.thumbnailSuggestions}</p>
                        </div>
                    )}
                </div>
            );
        } catch (error) {
            console.error('Error parsing content:', error);
            return <p>Error displaying content.</p>;
        }
    };

    return (
        <div>
            <h2>{campaign.title}</h2>
            <Link to={`/create-post/${campaign._id}`}>Create New Post</Link>
            <div>
                {campaign.posts.map(post => (
                    <div key={post._id} className="post mb-8 p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2 text-blue-600">{post.topic} - {post.platform}</h3>
                        <div className="whitespace-pre-line">
                            {renderPostContent(post.content, post.platform)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
