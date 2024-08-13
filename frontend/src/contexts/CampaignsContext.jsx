import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCampaigns as getCampaignsAPI, createCampaign as createCampaignAPI, createTopic as createTopicAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CampaignsContext = createContext();

export const useCampaigns = () => useContext(CampaignsContext);

export const CampaignsProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = useCallback(async () => {
    if (!user) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCampaignsAPI();
      const sortedCampaigns = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCampaigns(sortedCampaigns);
    } catch (error) {
      toast.error('Failed to load campaigns. Please reload.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      loadCampaigns();
    }
  }, [authLoading, user, loadCampaigns]);

  const createCampaign = async (title) => {
    try {
      await createCampaignAPI(title);
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to create campaign. Please try again.');
    }
  };

  const createTopic = async (title, campaignId) => {
    try {
      await createTopicAPI(title, campaignId);
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to create topic. Please try again.');
    }
  };

  return (
    <CampaignsContext.Provider value={{ campaigns, createCampaign, createTopic, loadCampaigns, loading }}>
      {children}
    </CampaignsContext.Provider>
  );
};
