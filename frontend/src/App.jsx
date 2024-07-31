import React, { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const platforms = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'YouTube', 'Pinterest'];
  const tones = ['Professional', 'Casual', 'Enthusiastic'];
  const styles = ['Formal', 'Informal'];

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
      } else {
        console.error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AI Social Media Post Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Platform:</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} required>
            <option value="">Select a platform</option>
            {platforms.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Tone:</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} required>
            <option value="">Select a tone</option>
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Style:</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} required>
            <option value="">Select a style</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Media URL (optional):</label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
      {generatedContent && (
        <div className="generated-content">
          <h2>Generated Content:</h2>
          <p>{generatedContent}</p>
        </div>
      )}
    </div>
  );
}

export default App;
