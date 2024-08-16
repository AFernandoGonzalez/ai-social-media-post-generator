import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCampaigns as getCampaignsAPI, createCampaign as createCampaignAPI, createTopic as createTopicAPI } from '../services/api';
import { useAuth } from './AuthContext';
import useCustomToast from '../utils/useCustomToast';

const CampaignsContext = createContext();

export const useCampaigns = () => useContext(CampaignsContext);

export const CampaignsProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const showToast = useCustomToast();

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
      showToast('Failed to load campaigns. Please reload.', 'error', '❗');
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
      showToast('Campaign created successfully!', 'success', '🎉');
    } catch (error) {
      showToast('Failed to create campaign. Please try again.', 'error', '❗');
    }
  };

  const createTopic = async (title, campaignId) => {
    try {
      await createTopicAPI(title, campaignId);
      loadCampaigns();
      showToast('Topic created successfully!', 'success', '✅');
    } catch (error) {
      showToast('Failed to create topic. Please try again.', 'error', '❗');
    }
  };

  return (
    <CampaignsContext.Provider value={{ campaigns, createCampaign, createTopic, loadCampaigns, loading }}>
      {children}
    </CampaignsContext.Provider>
  );
};
