const API_BASE_URL = 'http://localhost:8000/api';

export const getCampaigns = async () => {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    return response.json();
};

export const getCampaignById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
    return response.json();
};

export const createCampaign = async (title) => {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    return response.json();
};

export const getTopicById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/topics/${id}`);
    return response.json();
};

export const createTopic = async (title, campaignId) => {
    const response = await fetch(`${API_BASE_URL}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, campaignId })
    });
    return response.json();
};

export const generateContent = async (topicId, platform, type, tone, style, mediaUrl) => {
    const response = await fetch(`${API_BASE_URL}/topics/${topicId}/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, type, tone, style, mediaUrl })
    });
    return response.json();
};
