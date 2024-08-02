import React, { useState } from 'react';
import { tones, styles } from '../utils/styleConstants';
import { platforms } from '../utils/platformContants';

const GenerateContentModal = ({ onClose, onGenerate, topicTitle }) => {
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');


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
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Generate Content for {topicTitle}</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {!selectedPlatform && (
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Select Platform and Content Type:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {platforms.map((platform) => (
                                <div
                                    key={`${platform.platform}-${platform.type}`}
                                    className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleCardClick(platform.platform, platform.type)}
                                >
                                    <i className={`${platform.icon} text-2xl mb-2`}></i>
                                    <p>{platform.platform} - {platform.type}</p>
                                </div>
                            ))}
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
