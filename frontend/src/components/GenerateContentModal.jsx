import React, { useState } from 'react';

const GenerateContentModal = ({ onClose, onGenerate, topicTitle }) => {
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [search, setSearch] = useState('');

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

    const contentOptions = [
        { platform: 'Instagram', type: 'caption' },
        { platform: 'Instagram', type: 'hashtags' },
        { platform: 'Facebook', type: 'description' },
        { platform: 'Twitter', type: 'tweet' },
        // Add more options as needed
    ];

    const filteredOptions = contentOptions.filter(option =>
        option.platform.toLowerCase().includes(search.toLowerCase()) ||
        option.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Generate Content for {topicTitle}</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">&times;</button>
                </div>
                {!selectedPlatform && (
                    <div>
                        <input
                            type="text"
                            placeholder="Search for platform or content type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded mb-4 w-full"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            {filteredOptions.map(option => (
                                <div
                                    key={`${option.platform}-${option.type}`}
                                    className="bg-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-300"
                                    onClick={() => handleCardClick(option.platform, option.type)}
                                >
                                    {option.platform} - {option.type}
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
