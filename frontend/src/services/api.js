import { auth } from '../config/firebaseConfig';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  throw new Error('No user logged in');
};

const handleErrors = (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('An error occurred while fetching data');
  }
  return response.json();
};

export const createUserInDB = async (uid, email, firstName, lastName) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ uid, email, firstName, lastName })
  });
  return handleErrors(response);
};

export const getUserProfile = async () => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleErrors(response);
};

export const getCampaigns = async () => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/campaigns`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleErrors(response);
};

export const getCampaignById = async (id) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleErrors(response);
};

export const createCampaign = async (title) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });
  return handleErrors(response);
};

export const getTopicById = async (id) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleErrors(response);
};

export const createTopic = async (title, campaignId) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, campaignId })
  });
  return handleErrors(response);
};

export const generateContent = async (topicId, platform, type, tone, style, mediaUrl) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/topics/${topicId}/generate-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ platform, type, tone, style, mediaUrl })
  });
  const data = await response.json();
  return data.text;
};

export const saveContent = async (topicId, content) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/topics/${topicId}/save-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(content)
  });
  return handleErrors(response);
};
