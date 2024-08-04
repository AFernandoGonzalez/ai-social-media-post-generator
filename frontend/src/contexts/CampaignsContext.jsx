import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCampaigns as getCampaignsAPI, createCampaign as createCampaignAPI, createTopic as createTopicAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CampaignsContext = createContext();

export const useCampaigns = () => useContext(CampaignsContext);

export const CampaignsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState([]);

  const loadCampaigns = useCallback(async () => {
    try {
      const data = await getCampaignsAPI();
      setCampaigns(data);
    } catch (error) {
      toast.error('Failed to load campaigns. Please login.');
      setCampaigns([]);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadCampaigns();
    }
  }, [currentUser, loadCampaigns]);

  const createCampaign = async (title) => {
    try {
      await createCampaignAPI(title);
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to create campaign.');
    }
  };

  const createTopic = async (title, campaignId) => {
    try {
      await createTopicAPI(title, campaignId);
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to create topic.');
    }
  };

  return (
    <CampaignsContext.Provider value={{ campaigns, createCampaign, createTopic, loadCampaigns }}>
      {children}
    </CampaignsContext.Provider>
  );
};
