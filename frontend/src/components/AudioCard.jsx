import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaEdit, FaTrash } from 'react-icons/fa';
import { useAudio } from '../contexts/AudioContext';
import { capitalizeFirstLetter  } from '../utils/stringCapitalizer'

const AudioCard = ({ audio, onEdit, onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const { playAudio, currentAudio, setCurrentAudio, isPlaying: globalIsPlaying } = useAudio();

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
        audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
    };

    const handleSkipBackward = () => {
        audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    useEffect(() => {
        const updateProgress = () => {
            setProgress(audioRef.current.currentTime);
        };

        const handleLoadedMetadata = () => {
            setProgress(0);
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateProgress);
            audioRef.current.addEventListener('ended', handleEnded);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, []);

    useEffect(() => {
        if (currentAudio !== audioRef.current) {
            setIsPlaying(false);
        }
    }, [currentAudio]);

    return (
        <div className="audio-card bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-lg shadow-lg text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-25 rounded-lg"></div>
            <div className="relative z-10">
                <img src="https://images.unsplash.com/photo-1563891217861-7924b471afb3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt={audio.title} className="rounded-lg shadow-md w-full h-[200px] object-cover mb-4" />
                <h2 className="text-lg font-semibold">{capitalizeFirstLetter(audio.title)}</h2>
                <p className="text-gray-300">{new Date(audio.createdAt).toLocaleString()}</p>
                <audio ref={audioRef} className="w-full mt-4" src={audio.presignedUrl}>
                    Your browser does not support the audio element.
                </audio>
                <div className="audio-controls flex items-center justify-around mt-4">
                    <button className="text-white" onClick={handleSkipBackward}><FaBackward /></button>
                    <button className="text-white" onClick={handlePlayPause}>
                        {isPlaying && currentAudio === audioRef.current ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="text-white" onClick={handleSkipForward}><FaForward /></button>
                    <button className="text-white" onClick={() => onEdit(audio)}><FaEdit /></button>
                    <button className="text-white" onClick={() => onDelete(audio._id)}><FaTrash /></button>
                </div>
                <input
                    type="range"
                    min="0"
                    max={audioRef.current?.duration || 0}
                    step="1"
                    value={progress}
                    onChange={handleProgressChange}
                    className="w-full mt-4"
                />
                <div className="time-info flex justify-between mt-2 text-sm">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(audioRef.current?.duration || 0)}</span>
                </div>
            </div>
        </div>
    );
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default AudioCard;
