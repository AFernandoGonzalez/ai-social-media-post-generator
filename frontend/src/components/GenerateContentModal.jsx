import React, { useState } from 'react';
import { tones, styles } from '../utils/styleConstants';
import { platforms } from '../utils/platformConstants';

const GenerateContentModal = ({ onClose, onGenerate, topicTitle }) => {
    const [step, setStep] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCardClick = (platform, type) => {
        setSelectedPlatform(platform);
        setSelectedType(type);
        setStep(2);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        await onGenerate(selectedPlatform, selectedType, tone, style, mediaUrl);
        setIsLoading(false);
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

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Generate Content for {topicTitle}</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 border-t-blue-500 animate-spin"></div>
                    </div>
                ) : (
                    <div>
                        {step === 1 && (
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
                        {step === 2 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2">{selectedPlatform} - {selectedType}</h4>
                                <div className="mb-4">
                                    <h5 className="font-medium mb-2">Select Tone:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {tones.map(toneOption => (
                                            <div
                                                key={toneOption}
                                                className={`bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 ${tone === toneOption ? 'bg-blue-100' : ''}`}
                                                onClick={() => handleToneClick(toneOption)}
                                            >
                                                {toneOption}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h5 className="font-medium mb-2">Select Style:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {styles.map(styleOption => (
                                            <div
                                                key={styleOption}
                                                className={`bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 ${style === styleOption ? 'bg-blue-100' : ''}`}
                                                onClick={() => handleStyleClick(styleOption)}
                                            >
                                                {styleOption}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Media URL:</label>
                                    <input
                                        type="text"
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                                >
                                    Generate
                                </button>
                                <button
                                    onClick={handleBack}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateContentModal;
