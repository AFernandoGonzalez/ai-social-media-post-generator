import React, { useState } from 'react';

const ContentModal = ({ content, onClose, onTranslate, onUpdate }) => {
    const [translatedText, setTranslatedText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('German');

    const handleTranslate = async () => {
        
        setTranslatedText("translating....");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText);
        alert("Translated text copied to clipboard!");
    };

    const handleUpdate = () => {
        onUpdate(content.id, translatedText);
        alert("Content updated with the translated text!");
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full h-full flex flex-col md:flex-row justify-center items-center">
                <button onClick={onClose} className="fixed top-5 right-5 text-gray-600 hover:text-gray-900">
                    <i className="fas fa-times"></i>
                </button>
                <div className="flex flex-col md:flex-row w-full h-full">
                    <div className="w-full md:w-1/2 p-4 flex flex-col justify-between items-center h-full">
                        <h3 className="text-lg font-bold mb-4">{content.type} ({content.platform})</h3>
                        <textarea
                            readOnly
                            value={content.text}
                            className="w-full h-full md:h-2/3 p-4 border rounded-md resize-none"
                        />
                        <div className="flex items-center mt-4">
                            <label className="mr-2">Translate to:</label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                className="border p-2 rounded-md"
                            >
                                <option value="German">German</option>
                                <option value="French">French</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Italian">Italian</option>
                               
                            </select>
                            <button
                                onClick={handleTranslate}
                                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                            >
                                Translate
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-4 flex flex-col justify-between items-center border-t md:border-t-0 md:border-l h-full">
                        <h3 className="text-lg font-bold mb-4">Translated Text</h3>
                        <textarea
                            readOnly
                            value={translatedText}
                            className="w-full h-1/2 md:h-2/3 p-4 border rounded-md resize-none"
                        />
                        <div className="flex items-center mt-4">
                            <button
                                onClick={handleCopy}
                                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                            >
                                Copy Translated Text
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                            >
                                Update with Translated Text
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentModal;
