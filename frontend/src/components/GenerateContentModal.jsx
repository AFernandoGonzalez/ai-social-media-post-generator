import React, { useState } from 'react';

const GenerateContentModal = ({ onClose, onGenerate, topicTitle }) => {
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');

    const tones = ['Professional', 'Casual', 'Enthusiastic', 'Humorous', 'Serious'];
    const styles = ['Formal', 'Informal', 'Friendly', 'Authoritative', 'Conversational'];

    const handleCardClick = (platform, type) => {
        setSelectedPlatform(platform);
        setSelectedType(type);
    };

    const handleGenerate = () => {
        onGenerate(selectedPlatform, selectedType, tone, style, mediaUrl);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Generate Content for {topicTitle}</h3>
                {!selectedPlatform && (
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Select Platform and Content Type:</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="bg-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-300"
                                onClick={() => handleCardClick('Instagram', 'Caption')}
                            >
                                Instagram - Caption
                            </div>
                            <div
                                className="bg-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-300"
                                onClick={() => handleCardClick('Instagram', 'Hashtags')}
                            >
                                Instagram - Hashtags
                            </div>
                            <div
                                className="bg-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-300"
                                onClick={() => handleCardClick('Facebook', 'Description')}
                            >
                                Facebook - Description
                            </div>
                            <div
                                className="bg-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-300"
                                onClick={() => handleCardClick('Twitter', 'Tweet')}
                            >
                                Twitter - Tweet
                            </div>
                            {/* Add more cards as needed */}
                        </div>
                    </div>
                )}
                {selectedPlatform && (
                    <div>
                        <h4 className="text-lg font-semibold mb-2">{selectedPlatform} - {selectedType}</h4>
                        <label className="block mb-2">Tone:</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value="">Select Tone</option>
                            {tones.map(toneOption => (
                                <option key={toneOption} value={toneOption}>{toneOption}</option>
                            ))}
                        </select>
                        <label className="block mb-2">Style:</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value="">Select Style</option>
                            {styles.map(styleOption => (
                                <option key={styleOption} value={styleOption}>{styleOption}</option>
                            ))}
                        </select>
                        <label className="block mb-2">Media URL:</label>
                        <input
                            type="text"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        />
                        <button
                            onClick={handleGenerate}
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                        >
                            Generate
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateContentModal;
