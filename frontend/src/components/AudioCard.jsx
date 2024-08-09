import React, { useRef, useState, useEffect } from "react";
import {
    FaPlay,
    FaPause,
    FaForward,
    FaBackward,
    FaEllipsisV
} from "react-icons/fa";
import Modal from './Modal';
import { useAudio } from "../contexts/AudioContext";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import { motion } from "framer-motion";

const AudioCard = ({ audio, onPlay, audioUrl, isPlaying: globalIsPlaying }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(audio.title);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const audioRef = useRef(null);
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

    const handleProgressChange = (event) => {
        const newProgress = event.target.value;
        audioRef.current.currentTime = newProgress;
        setProgress(newProgress);
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
        <div className="audio-card bg-gray-800 p-4 rounded-lg shadow-lg relative text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">

                <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                    <button
                        onClick={handleSkipBackward}
                        className="text-gray-300 hover:text-white mx-1"
                    >
                        <FaBackward className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="bg-green-500 p-2 rounded-full text-white mx-1"
                    >
                        {isPlaying && currentAudio === audioRef.current ? (
                            <FaPause className="w-4 h-4" />
                        ) : (
                            <FaPlay className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={handleSkipForward}
                        className="text-gray-300 hover:text-white mx-1"
                    >
                        <FaForward className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-0">
                        <img
                            src="https://images.unsplash.com/photo-1563891217861-7924b471afb3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt={audio.title}
                            className="rounded-lg w-16 h-16 object-cover mb-4 sm:mb-0"
                        />
                        <div>
                            <h2 className="text-md font-medium">
                                {capitalizeFirstLetter(audio.title)}
                            </h2>
                            <p className="text-sm text-gray-400">
                                Created: {new Date(audio.createdAt).toLocaleDateString()}
                            </p>
                            
                        </div>
                        <button
                            onClick={handleDropdownToggle}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none ml-auto"
                        >
                            <FaEllipsisV />
                        </button>
                    </div>

                    <audio ref={audioRef} src={audio.presignedUrl} onEnded={handleEnded} >
                        Your browser does not support the audio element.
                    </audio>

                    <div className="flex items-center justify-between text-sm mt-2 text-gray-400">
                        <span className="mr-1">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="1"
                            value={progress}
                            onChange={handleProgressChange}
                            className="w-full "
                        />
                        <span className="ml-1">
                            -{!isNaN(duration) ? formatTime(duration - progress) : "0:00"}
                        </span>
                    </div>

                    {dropdownOpen && (
                        <motion.div
                            ref={dropdownRef}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={dropdownVariants}
                            className="absolute right-0 top-0 mt-8 w-32 bg-white rounded-md shadow-lg z-20"
                        >
                            <a
                                onClick={startEditing}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <i className="fas fa-edit mr-2"></i> Edit
                            </a>
                            <a
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <i className="fas fa-trash mr-2"></i> Delete
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>

          
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Title">
                <form onSubmit={handleUpdate}>
                    <label htmlFor="newTitle" className="block text-gray-700 font-bold mb-2">Enter New Title</label>
                    <input
                        id="newTitle"
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                        placeholder="Enter new title"
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
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
                <p className="text-gray-700 mb-4">Are you sure you want to delete this audio file?</p>
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

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

export default AudioCard;
