import React, { useState } from 'react';
import { tones, styles } from '../utils/styleConstants';
import { platforms } from '../utils/platformConstants';
import Button from './Button';
import { capitalizeFirstLetter } from '../utils/stringCapitalizer';
import { AnimatePresence, motion } from 'framer-motion';

const LoadingCard = ({ platform, type, message }) => {
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
        <div className="bg-white p-4 sm:p-8 rounded-lg w-full text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{message}</h3>
            <p className="text-gray-600 mb-6">{message.includes("Saving") ? "Saving content, please wait..." : `Creating ${platform} ${type}, please wait...`}</p>
            <div className="flex justify-center mb-4">
                <i className={`fab fa-${platform.toLowerCase()} text-4xl sm:text-6xl animate-bounce`} style={{ color: getPlatformColor(platform) }}></i>
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
    const [isSaving, setIsSaving] = useState(false);
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
        setIsSaving(true);
        await onSave(selectedPlatform, selectedType, generatedText);
        setIsSaving(false);
        setStep(4);
        setTimeout(() => {
            onClose();
        }, 2000);
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
            setTone('')
            setStyle('')
        }
    };

    const filteredPlatforms = platforms.filter(platform =>
        platform.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const popularPlatforms = platforms.filter(platform => platform.popular);

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
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-4xl h-[80vh] max-h-[90vh] overflow-auto flex flex-col"
                >
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Generate Content for - {capitalizeFirstLetter(topicTitle)}</h3>
                        <Button onClick={onClose} variant="default" className="text-gray-600 hover:text-gray-900">
                            <i className="fas fa-times text-2xl"></i>
                        </Button>
                    </div>
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center justify-between gap-1.5 sm:gap-3 mb-4 sm:mb-6">
                            <div className="relative">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-xs sm:text-sm relative z-10 transition-colors duration-300 ${step >= 1 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-300'}`}>
                                    {step > 1 ? <i className="fas fa-check text-white"></i> : '1'}
                                </div>
                                {step > 1 && <div className="absolute z-0 -inset-1 bg-indigo-100 rounded-full animate-pulse"></div>}
                            </div>
                            <div className="w-full h-1 rounded-full bg-gray-200 relative">
                                <div className={`absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full`} style={{ width: `${step >= 2 ? '100%' : '50%'}` }}></div>
                            </div>
                            <div className="relative">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-xs sm:text-sm relative z-10 transition-colors duration-300 ${step >= 2 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-300'}`}>
                                    {step > 2 ? <i className="fas fa-check text-white"></i> : '2'}
                                </div>
                                {step > 2 && <div className="absolute z-0 -inset-1 bg-indigo-100 rounded-full animate-pulse"></div>}
                            </div>
                            <div className="w-full h-1 rounded-full bg-gray-200 relative">
                                <div className={`absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full`} style={{ width: `${step >= 3 ? '100%' : '0%'}` }}></div>
                            </div>
                            <div className="relative">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-xs sm:text-sm relative z-10 transition-colors duration-300 ${step >= 3 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-300'}`}>
                                    {step > 3 ? <i className="fas fa-check text-white"></i> : '3'}
                                </div>
                                {step > 3 && <div className="absolute z-0 -inset-1 bg-indigo-100 rounded-full animate-pulse"></div>}
                            </div>
                            <div className="w-full h-1 rounded-full bg-gray-200 relative">
                                <div className={`absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full`} style={{ width: `${step >= 4 ? '100%' : '0%'}` }}></div>
                            </div>
                            <div className="relative">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-xs sm:text-sm relative z-10 transition-colors duration-300 ${step >= 4 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-300'}`}>
                                    {step > 4 ? <i className="fas fa-check text-white"></i> : '4'}
                                </div>
                                {step > 4 && <div className="absolute z-0 -inset-1 bg-indigo-100 rounded-full animate-pulse"></div>}
                            </div>
                        </div>
                        <div className="flex-grow overflow-auto">
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
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-6">
                                        {searchQuery
                                            ? filteredPlatforms.map((platform) => (
                                                <div
                                                    key={platform.key || `${platform.platform}-${platform.type}`}
                                                    className={`${getPlatformClass(platform.platform)} p-4 sm:p-6 rounded-lg cursor-pointer flex flex-col items-center justify-center text-center`}
                                                    onClick={() => handleCardClick(platform.platform, platform.type)}
                                                >
                                                    <i className={`${platform.icon} text-2xl sm:text-3xl mb-2`}></i>
                                                    <p className="text-sm font-medium">{platform.platform} - {platform.type}</p>
                                                </div>
                                            ))
                                            : popularPlatforms.map((platform) => (
                                                <div
                                                    key={platform.key || `${platform.platform}-${platform.type}`}
                                                    className={`${getPlatformClass(platform.platform)} p-4 sm:p-6 rounded-lg cursor-pointer flex flex-col items-center justify-center text-center`}
                                                    onClick={() => handleCardClick(platform.platform, platform.type)}
                                                >
                                                    <i className={`${platform.icon} text-2xl sm:text-3xl mb-2`}></i>
                                                    <p className="text-sm font-medium">{platform.platform} - {platform.type}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                            {step === 2 && isLoading && (
                                <LoadingCard platform={selectedPlatform} type={selectedType} message="Generating Content" />
                            )}
                            {step === 2 && !isLoading && (
                                <div>
                                    <div className="mb-4">
                                        <Button onClick={handleBack} variant="back">
                                            <i className="fas fa-arrow-left mr-2"></i> Back
                                        </Button>
                                    </div>
                                    <h4 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">{selectedPlatform} - {selectedType}</h4>

                                    <div className="mb-8">
                                        <h5 className="text-lg sm:text-xl font-medium mb-4">Select Tone: (optional)</h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {tones.map(toneOption => (
                                                <div
                                                    key={toneOption}
                                                    className={`p-4 rounded-lg cursor-pointer flex items-center justify-center text-center font-medium ${tone === toneOption ? 'bg-gray-900 text-white hover:bg-gray-900' : 'bg-gray-100 hover:bg-gray-300'} transition`}
                                                    onClick={() => handleToneClick(toneOption)}
                                                >
                                                    {toneOption}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h5 className="text-lg sm:text-xl font-medium mb-4">Select Style: (optional)</h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {styles.map(styleOption => (
                                                <div
                                                    key={styleOption}
                                                    className={`p-4 rounded-lg cursor-pointer flex items-center justify-center text-center font-medium ${style === styleOption ? 'bg-gray-900 text-white hover:bg-gray-900' : 'bg-gray-100 hover:bg-gray-300'} transition`}
                                                    onClick={() => handleStyleClick(styleOption)}
                                                >
                                                    {styleOption}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 justify-center">
                                        <Button onClick={handleGenerate} variant="primary">
                                            Generate
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {step === 3 && isLoading && (
                                <LoadingCard platform={selectedPlatform} type={selectedType} message="Generating Content" />
                            )}
                            {step === 3 && !isLoading && (
                                <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Generated Content</h4>
                                    <textarea
                                        readOnly
                                        value={generatedText}
                                        className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between">
                                        <Button onClick={handleBack} variant="back">
                                            Back
                                        </Button>
                                        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-2">
                                            <Button onClick={handleSave} variant="primary">
                                                Save
                                            </Button>
                                            <Button onClick={handleGenerate} variant="secondary">
                                                Regenerate
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {step === 4 && isSaving && (
                                <LoadingCard platform={selectedPlatform} type={selectedType} message="Saving Content" />
                            )}
                            {step === 4 && !isSaving && (
                                <div className="p-6 bg-gray-50 rounded-lg shadow-md h-full justify-between">
                                    <div className='flex flex-col justify-center h-full'>
                                        <h4 className="text-xl text-center font-bold text-gray-800 mb-8">Content Saved!</h4>
                                        <div className="flex justify-center align-center ">
                                            <i className="fas fa-check-circle text-6xl text-green-500 animate-bounce"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GenerateContentModal;
