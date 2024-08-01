import React, { useState, useEffect } from 'react';

import {marked} from 'marked';


function App() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const platforms = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'YouTube', 'Pinterest'];
  const tones = ['Professional', 'Casual', 'Enthusiastic'];
  const styles = ['Formal', 'Informal'];

  useEffect(() => {
    fetch('http://localhost:8000/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          style,
          mediaUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.post.content);
        setPosts([...posts, data.post]);
      } else {
        console.error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
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
      imageSuggestion: ''
    };

    const extractContent = (pattern, fallback) => {
      const match = content.match(pattern);
      return match ? match[1]?.trim() : fallback;
    };

    switch (platform) {
      case 'Instagram':
        parsedContent.caption = extractContent(/Caption:(.*?)Hashtags:/s, '') || extractContent(/(.*?)#/s, '');
        parsedContent.hashtags = extractContent(/Hashtags:(.*?)Call-to-action:/s, '') || extractContent(/#(.*)/s, '');
        parsedContent.callToAction = extractContent(/Call-to-action:(.*)/s, '');
        break;
      case 'Twitter':
        parsedContent.text = extractContent(/Text:(.*?)Hashtags:/s, '') || content.split('#')[0];
        parsedContent.hashtags = extractContent(/Hashtags:(.*)/s, '') || content.match(/#(.*)/)?.[0] || '';
        break;
      case 'Facebook':
        parsedContent.text = extractContent(/Text:(.*?)Hashtags:/s, '') || content.split('#')[0];
        parsedContent.hashtags = extractContent(/Hashtags:(.*)/s, '') || content.match(/#(.*)/)?.[0] || '';
        break;
      case 'LinkedIn':
        parsedContent.text = extractContent(/Text:(.*?)Professional Hashtags:/s, '') || content.split('#')[0];
        parsedContent.professionalHashtags = extractContent(/Professional Hashtags:(.*)/s, '') || content.match(/#(.*)/)?.[0] || '';
        break;
      case 'YouTube':
        parsedContent.title = extractContent(/Title:(.*?)Description:/s, '') || content.split('\n')[0];
        parsedContent.description = extractContent(/Description:(.*?)Tags:/s, '') || content;
        parsedContent.tags = extractContent(/Tags:(.*?)Thumbnail Suggestions:/s, '') || content.match(/#(.*)/)?.[0] || '';
        parsedContent.thumbnailSuggestions = extractContent(/Thumbnail Suggestions:(.*)/s, '');
        break;
      case 'Pinterest':
        parsedContent.title = extractContent(/Title:(.*?)Description:/s, '') || content.split('\n')[0];
        parsedContent.description = extractContent(/Description:(.*?)Hashtags:/s, '') || content;
        parsedContent.hashtags = extractContent(/Hashtags:(.*?)Image suggestion:/s, '') || content.match(/#(.*)/)?.[0] || '';
        parsedContent.imageSuggestion = extractContent(/Image suggestion:(.*)/s, '');
        break;
      default:
        parsedContent.text = content;
        break;
    }

    return parsedContent;
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Social Media Post Generator</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select a platform</option>
            {platforms.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tone:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Style:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Media URL (optional):</label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
      {generatedContent && (
        <div className="generated-content">
          <h2 className="text-xl font-semibold mb-2">Generated Content:</h2>
          <p className="whitespace-pre-wrap">{generatedContent}</p>
        </div>
      )}
      <div className="saved-posts mt-6">
        <h2 className="text-xl font-semibold mb-4">Saved Posts:</h2>
        {posts.map((post) => {
          const parsedContent = parseGeneratedContent(post.content, post.platform);
          return (
            <div key={post._id} className="post mb-6">
              <h3 className="text-lg font-semibold mb-2">{post.topic} - {post.platform}</h3>
              {parsedContent.caption && (
                <div>
                  <strong className="block font-medium mb-1">Caption:</strong>
                  <p>{parsedContent.caption}</p>
                </div>
              )}
              {parsedContent.text && (
                <div>
                  <strong className="block font-medium mb-1">Text:</strong>
                  <p>{parsedContent.text}</p>
                  
                </div>
              )}
              {parsedContent.hashtags && (
                <div>
                  <strong className="block font-medium mb-1">Hashtags:</strong>
                  <p>{parsedContent.hashtags}</p>
                </div>
              )}
              {parsedContent.callToAction && (
                <div>
                  <strong className="block font-medium mb-1">Call-to-action:</strong>
                  <p>{parsedContent.callToAction}</p>
                </div>
              )}
              {parsedContent.professionalHashtags && (
                <div>
                  <strong className="block font-medium mb-1">Professional Hashtags:</strong>
                  <p>{parsedContent.professionalHashtags}</p>
                </div>
              )}
              {parsedContent.title && (
                <div>
                  <strong className="block font-medium mb-1">Title:</strong>
                  <p>{parsedContent.title}</p>
                </div>
              )}
              {parsedContent.description && (
                <div>
                  <strong className="block font-medium mb-1">Description:</strong>
                  <p>{parsedContent.description}</p>
                </div>
              )}
              {parsedContent.tags && (
                <div>
                  <strong className="block font-medium mb-1">Tags:</strong>
                  <p>{parsedContent.tags}</p>
                </div>
              )}
              {parsedContent.thumbnailSuggestions && (
                <div>
                  <strong className="block font-medium mb-1">Thumbnail Suggestions:</strong>
                  <p>{parsedContent.thumbnailSuggestions}</p>
                </div>
              )}
              {parsedContent.imageSuggestion && (
                <div>
                  <strong className="block font-medium mb-1">Image Suggestion:</strong>
                  <p>{parsedContent.imageSuggestion}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
