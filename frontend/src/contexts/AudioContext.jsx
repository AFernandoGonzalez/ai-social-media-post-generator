import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { fetchUserAudios, saveTextAudio, updateAudioFileName, deleteAudio } from '../services/api';
import { useAuth } from './AuthContext';
import useCustomToast from '../utils/useCustomToast';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const showToast = useCustomToast();

    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const loadAudios = useCallback(async () => {
        if (!user) {
            setAudios([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const audiosData = await fetchUserAudios();
            setAudios(audiosData);
        } catch (error) {
            showToast('Failed to load audios. Please refresh the page.', 'error', '❗');
            setAudios([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && user) {
            loadAudios();
        }
    }, [authLoading, user, loadAudios]);

    const saveAudio = async ({ text, title }) => {
        setLoading(true);
        try {
            await saveTextAudio({ text, title });
            loadAudios();
            showToast('Audio saved successfully!', 'success', '🎉');

        } catch (error) {
            showToast('Failed to save audio.', 'error', '❗');
        } finally {
            setLoading(false);
        }
    };

    const updateAudio = async (id, fileName) => {
        setLoading(true);
        try {
            await updateAudioFileName(id, fileName);
            loadAudios();
            showToast('Audio updated successfully!', 'success', '✅');

        } catch (error) {
            showToast('Failed to update audio.', 'error', '❗');
        } finally {
            setLoading(false);
        }
    };

    const removeAudio = async (id) => {
        setLoading(true);
        try {
            await deleteAudio(id);
            loadAudios();
            showToast('Audio deleted successfully!', 'success', '🗑️');
        } catch (error) {
            showToast('Failed to delete audio.', 'error', '❗');
        } finally {
            setLoading(false);
        }
    };

    const playAudio = (audioElement, audio) => {
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
        }
        setCurrentAudio(audioElement);
        audioElement.play();
        setIsPlaying(true);
    };

    const pauseAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <AudioContext.Provider value={{
            audios, saveAudio, updateAudio, removeAudio, loadAudios, loading, playAudio, pauseAudio, isPlaying, currentAudio
        }}>
            {children}
        </AudioContext.Provider>
    );
};
