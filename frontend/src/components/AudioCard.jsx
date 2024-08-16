import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward, FaEllipsisV, FaVolumeUp, FaDownload } from "react-icons/fa";
import Modal from './Modal';
import { useAudio } from "../contexts/AudioContext";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import albumai from '../assets/albumai.webp';

const AudioCard = ({ audio, onPlay, audioUrl, isPlaying: globalIsPlaying }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(audio.title);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const audioRef = useRef(null);
    const { isDarkMode } = useTheme();
    const {
        playAudio,
        updateAudio,
        removeAudio,
        currentAudio,
        setCurrentAudio,
    } = useAudio();

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            playAudio(audioRef.current, audioRef.current);
            setIsPlaying(true);
        }
    };


    const handleSkipForward = () => {
        audioRef.current.currentTime = Math.min(
            audioRef.current.currentTime + 10,
            audioRef.current.duration
        );
    };

    const handleSkipBackward = () => {
        audioRef.current.currentTime = Math.max(
            audioRef.current.currentTime - 10,
            0
        );
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };



    useEffect(() => {
        const updateProgress = () => setProgress(audioRef.current.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(audioRef?.current?.duration);
            setProgress(0);
        };

        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", updateProgress);
            audioRef.current.addEventListener("ended", handleEnded);
            audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("timeupdate", updateProgress);
                audioRef.current.removeEventListener("ended", handleEnded);
                audioRef.current.removeEventListener(
                    "loadedmetadata",
                    handleLoadedMetadata
                );
            }
        };
    }, []);

    useEffect(() => {
        if (currentAudio !== audioRef.current) {
            setIsPlaying(false);
        }
    }, [currentAudio]);

    const startEditing = () => {
        setNewTitle(audio.title);
        setIsEditModalOpen(true);
        setDropdownOpen(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateAudio(audio._id, newTitle);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update audio title');
        }
    };

    const handleDelete = async () => {
        try {
            await removeAudio(audio._id);
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Failed to delete audio');
        }
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOutsideClick = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <div className={`p-4 rounded-lg shadow-lg relative`}>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">

                <div className="flex flex-col items-center md:items-start">
                    <img
                        src={albumai}
                        alt={audio.title}
                        className="rounded-lg w-full object-contain mb-4 md:mb-0 md:w-[250px] h-[250px]"
                    />
                </div>

                <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="text-center md:text-left">
                            <h2 className="text-md font-medium">
                                {capitalizeFirstLetter(audio.title)}
                            </h2>
                            <p className={`${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} text-sm`}>
                                Created: {new Date(audio.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={handleDropdownToggle}
                            className={`mt-2 md:mt-0 md:ml-auto focus:outline-none ${isDarkMode ? 'text-dark-muted hover:text-dark-textPrimary' : 'text-light-muted hover:text-light-textPrimary'}`}
                        >
                            <FaEllipsisV />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={handleSkipBackward}
                            className={`mx-1 ${isDarkMode ? 'text-dark-muted hover:text-main-accent' : 'text-light-muted hover:text-main-accent'}`}
                        >
                            <FaBackward className="w-6 h-6" />
                        </button>

                        <audio
                            style={{
                                width: '100%',
                                height: '40px',
                                borderRadius: '8px',
                            }}
                            ref={audioRef}
                            src={audio.presignedUrl}
                            controls
                            onEnded={handleEnded}
                        >
                            Your browser does not support the audio element.
                        </audio>
                        <button
                            onClick={handleSkipForward}
                            className={`mx-1 ${isDarkMode ? 'text-dark-muted hover:text-main-accent' : 'text-light-muted hover:text-main-accent'}`}
                        >
                            <FaForward className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {dropdownOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className={`absolute right-0 top-0 mt-8 w-32 rounded-md shadow-lg z-20 ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'}`}
                    >
                        <a
                            onClick={startEditing}
                            className={`${isDarkMode ? 'hover:bg-dark-hover' : 'hover:bg-light-hover'} block px-4 py-2 text-sm cursor-pointer`}
                        >
                            <i className="fas fa-edit mr-2"></i> Edit
                        </a>
                        <a
                            onClick={() => setIsDeleteModalOpen(true)}
                            className={`${isDarkMode ? 'hover:bg-dark-hover' : 'hover:bg-light-hover'} block px-4 py-2 text-sm cursor-pointer`}
                        >
                            <i className="fas fa-trash mr-2"></i> Delete
                        </a>
                    </motion.div>
                )}
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Title">
                <form onSubmit={handleUpdate}>
                    <label htmlFor="newTitle" className={`block font-bold mb-2 ${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>Enter New Title</label>
                    <input
                        id="newTitle"
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'}`}
                        placeholder="Enter new title"
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="bg-main-accent hover:bg-main-accent-dark text-white font-bold py-2 px-4 rounded">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p className={`${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'} mb-4`}>Are you sure you want to delete this audio file?</p>
                <div className="flex justify-end">
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Confirm
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>



    );
};


export default AudioCard;
