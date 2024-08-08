import React, { createContext, useState, useCallback, useContext } from 'react';
import { fetchUserAudios, saveTextAudio, updateAudioFileName, deleteAudio } from '../services/api';
import { toast } from 'react-toastify';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const loadAudios = useCallback(async () => {
        setLoading(true);
        try {
            const audiosData = await fetchUserAudios();
            setAudios(audiosData);
        } catch (error) {
            toast.error('Failed to load audios. Please refresh the page.');
            setAudios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveAudio = async ({ text, title }) => {
        setLoading(true);
        try {
            await saveTextAudio({ text, title });
            loadAudios();
        } catch (error) {
            toast.error('Failed to save audio.');
        } finally {
            setLoading(false);
        }
    };

    const updateAudio = async (id, fileName) => {
        setLoading(true);
        try {
            await updateAudioFileName(id, fileName);
            loadAudios();
        } catch (error) {
            toast.error('Failed to update audio.');
        } finally {
            setLoading(false);
        }
    };

    const removeAudio = async (id) => {
        setLoading(true);
        try {
            await deleteAudio(id);
            loadAudios();
        } catch (error) {
            toast.error('Failed to delete audio.');
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
