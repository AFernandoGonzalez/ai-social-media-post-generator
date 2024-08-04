import React, { useState } from 'react';
import { tones, styles } from '../utils/styleConstants';
import { platforms } from '../utils/platformConstants';

const LoadingCard = ({ platform, type }) => {
    const platformColors = {
        instagram: '#E1306C',
        facebook: '#1877F2',
        twitter: '#1DA1F2',
        linkedin: '#0077B5',
        youtube: '#FF0000',
        tiktok: '#000000',
        pinterest: '#E60023',
    };

    const getPlatformColor = (platform) => platformColors[platform.toLowerCase()] || '#000000';

    return (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Content</h3>
                <p className="text-gray-600 mb-6">Creating {platform} {type}, please wait...</p>
                <div className="flex justify-center mb-4">
                    <i className={`fab fa-${platform.toLowerCase()} text-6xl animate-bounce`} style={{ color: getPlatformColor(platform) }}></i>
                </div>
            </div>
        </div>
    );
};

const GenerateContentModal = ({ onClose, onGenerate, onSave, topicTitle }) => {
    const [step, setStep] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCardClick = (platform, type) => {
        setSelectedPlatform(platform);
        setSelectedType(type);
        setStep(2);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        const text = await onGenerate(selectedPlatform, selectedType, tone, style, mediaUrl);
        setGeneratedText(text);
        setIsLoading(false);
        setStep(3);
    };

    const handleSave = async () => {
        await onSave(selectedPlatform, selectedType, generatedText);
        onClose();
    };

    const handleToneClick = (toneOption) => {
        setTone(toneOption);
    };

    const handleStyleClick = (styleOption) => {
        setStyle(styleOption);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const filteredPlatforms = platforms.filter(platform =>
        platform.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const platformColors = {
        instagram: 'bg-[#E1306C] hover:bg-[#c1275c] text-white',
        facebook: 'bg-[#1877F2] hover:bg-[#145db3] text-white',
        twitter: 'bg-[#1DA1F2] hover:bg-[#0d8bd0] text-white',
        linkedin: 'bg-[#0077B5] hover:bg-[#005582] text-white',
        youtube: 'bg-[#FF0000] hover:bg-[#cc0000] text-white',
        tiktok: 'bg-[#000000] hover:bg-[#333333] text-white',
        pinterest: 'bg-[#E60023] hover:bg-[#b8001c] text-white',
    };

    const getPlatformClass = (platform) => platformColors[platform.toLowerCase()] || 'bg-gray-100 hover:bg-gray-200';

    return (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
            <div className="flex flex-col md:justify-center bg-white p-8 rounded-lg w-full max-w-4xl h-full overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Generate Content for - {topicTitle}</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>
                {isLoading ? (
                    <LoadingCard platform={selectedPlatform} type={selectedType} />
                ) : (
                    <div>
                        {step === 1 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Select Platform and Content Type:</h4>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search platforms or content types"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full border p-3 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {filteredPlatforms.slice(0, 12).map((platform) => (
                                        <div
                                            key={`${platform.platform}-${platform.type}`}
                                            className={`${getPlatformClass(platform.platform)} p-6 rounded-lg cursor-pointer flex flex-col items-center justify-center text-center`}
                                            onClick={() => handleCardClick(platform.platform, platform.type)}
                                        >
                                            <i className={`${platform.icon} text-3xl mb-2`}></i>
                                            <p className="text-sm font-medium">{platform.platform} - {platform.type}</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <div className="mb-4">
                                    <button
                                        onClick={handleBack}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition inline-flex items-center"
                                    >
                                        <i className="fas fa-arrow-left mr-2"></i> Back
                                    </button>
                                </div>
                                <h4 className="text-2xl font-bold mb-6 text-gray-800">{selectedPlatform} - {selectedType}</h4>

                                <div className="mb-8">
                                    <h5 className="text-xl font-medium mb-4">Select Tone:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {tones.map(toneOption => (
                                            <div
                                                key={toneOption}
                                                className={`p-4 rounded-lg cursor-pointer flex items-center justify-center text-center font-medium ${tone === toneOption ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-gray-200 transition`}
                                                onClick={() => handleToneClick(toneOption)}
                                            >
                                                {toneOption}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h5 className="text-xl font-medium mb-4">Select Style:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {styles.map(styleOption => (
                                            <div
                                                key={styleOption}
                                                className={`p-4 rounded-lg cursor-pointer flex items-center justify-center text-center font-medium ${style === styleOption ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-gray-200 transition`}
                                                onClick={() => handleStyleClick(styleOption)}
                                            >
                                                {styleOption}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-xl font-medium text-gray-700 mb-2">Media URL:</label>
                                    <input
                                        type="text"
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        className="border p-3 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex space-x-4 justify-center">
                                    <button
                                        onClick={handleGenerate}
                                        className="bg-blue-500 text-white px-6 py-3 rounded-full w-full md:w-1/2 hover:bg-blue-600 transition"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                                <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Generated Content</h4>
                                    <textarea
                                        readOnly
                                        value={generatedText}
                                        className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex flex-col md:flex-row md:space-x-4">
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-500 text-white px-6 py-3 rounded-full mb-3 md:mb-0 hover:bg-blue-600 transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleGenerate}
                                            className="bg-yellow-500 text-white px-6 py-3 rounded-full mb-3 md:mb-0 hover:bg-yellow-600 transition"
                                        >
                                            Regenerate
                                        </button>
                                        <button
                                            onClick={handleBack}
                                            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400 transition"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>


                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateContentModal;
