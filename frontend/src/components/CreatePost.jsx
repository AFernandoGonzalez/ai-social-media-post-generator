import React, { useState } from 'react';

export const CreatePost = ({ campaignId }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const platforms = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'YouTube', 'Pinterest'];
    const tones = ['Professional', 'Casual', 'Enthusiastic'];
    const styles = ['Formal', 'Informal'];

    const handlePlatformClick = (platform) => {
        setSelectedPlatforms(prevState =>
            prevState.includes(platform)
                ? prevState.filter(p => p !== platform)
                : [...prevState, platform]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await Promise.all(selectedPlatforms.map(async (platform) => {
                const response = await fetch('http://localhost:8000/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ campaignId, platform, topic, tone, style, mediaUrl })
                });

                if (!response.ok) {
                    throw new Error(`Failed to create post for ${platform}`);
                }

                const data = await response.json();
                setGeneratedContent(prev => [...prev, { platform, content: data.post.content }]);
                console.log(`Post created for ${platform}:`, data.post);
            }));
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const parseGeneratedContent = (content, platform) => {
        let parsedContent = {
            caption: '',
            hashtags: '',
            callToAction: '',
            text: '',
            professionalHashtags: '',
            title: '',
            description: '',
            tags: '',
            thumbnailSuggestions: '',
            imageSuggestion: '',
        };

        const extractContent = (pattern) => {
            const match = content.match(pattern);
            return match ? match[1]?.trim() : '';
        };

        switch (platform) {
            case 'Instagram':
                parsedContent.caption = extractContent(/(?:1\. )?Caption:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.hashtags = extractContent(/(?:2\. )?Hashtags:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.callToAction = extractContent(/(?:3\. )?Call-to-action:(.*)/s) || content;
                break;
            case 'Twitter':
                parsedContent.text = extractContent(/(?:1\. )?Text:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.hashtags = extractContent(/(?:2\. )?Hashtags:(.*)/s) || content;
                break;
            case 'Facebook':
                parsedContent.text = extractContent(/(?:1\. )?Text:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.hashtags = extractContent(/(?:2\. )?Hashtags:(.*)/s) || content;
                break;
            case 'LinkedIn':
                parsedContent.text = extractContent(/(?:1\. )?Text:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.professionalHashtags = extractContent(/(?:2\. )?Professional Hashtags:(.*)/s) || content;
                break;
            case 'YouTube':
                parsedContent.title = extractContent(/(?:1\. )?Title:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.description = extractContent(/(?:2\. )?Description:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.tags = extractContent(/(?:3\. )?Tags:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.thumbnailSuggestions = extractContent(/(?:4\. )?Thumbnail Suggestions:(.*)/s) || content;
                break;
            case 'Pinterest':
                parsedContent.title = extractContent(/(?:1\. )?Title:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.description = extractContent(/(?:2\. )?Description:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.hashtags = extractContent(/(?:3\. )?Hashtags:(.*?)(?:\d\. |$)/s) || content;
                parsedContent.imageSuggestion = extractContent(/(?:4\. )?Image suggestion:(.*)/s) || content;
                break;
            default:
                parsedContent.text = content;
                break;
        }

        // Ensure all content is trimmed to remove any trailing spaces or unwanted characters
        Object.keys(parsedContent).forEach(key => {
            if (parsedContent[key]) {
                parsedContent[key] = parsedContent[key].replace(/^\d+\.\s*/, '').trim();
            }
        });

        return parsedContent;
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Topic:</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Enter the topic"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Select Platforms:</label>
                    <div className="flex flex-wrap gap-2">
                        {platforms.map((platform) => (
                            <button
                                key={platform}
                                type="button"
                                onClick={() => handlePlatformClick(platform)}
                                className={`px-4 py-2 rounded-lg ${selectedPlatforms.includes(platform)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Tone:</label>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Select a tone</option>
                        {tones.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Style:</label>
                    <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Select a style</option>
                        {styles.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Media URL (optional):</label>
                    <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Enter media URL"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : 'Generate Content'}
                </button>
            </form>
            {generatedContent && (
                <div className="generated-content mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Generated Content:</h2>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap text-gray-700">
                            {generatedContent.map((item, index) => (
                                <div key={index}>
                                    <h3 className="font-bold text-lg">{item.platform}:</h3>
                                    <p>{parseGeneratedContent(item.content, item.platform).text}</p>
                                </div>
                            ))}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
