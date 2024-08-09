import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Pagination from './Pagination';
import Loading from './Loading';
import { useAudio } from '../contexts/AudioContext';
import AudioCard from './AudioCard';
import AudioFilters from './AudioFilters';

const TextToSpeechForm = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Define modal states
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { audios, saveAudio, loadAudios, loading: loadingAudios } = useAudio();
  const audiosPerPage = 9;
  const totalPages = Math.ceil(audios.length / audiosPerPage);

  useEffect(() => {
    loadAudios();
  }, [loadAudios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await saveAudio({ text, title });
      setText('');
      setTitle('');
      setIsTextModalOpen(false);  // Close modal after submission
    } catch (err) {
      setError('Failed to generate speech');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const playAudio = (url) => setAudioUrl(url);

  const startIndex = (currentPage - 1) * audiosPerPage;

  const filteredAudios = audios.filter((audio) => {
    const matchesSearchTerm = audio.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? new Date(audio.createdAt).toISOString().split('T')[0] === dateFilter : true;
    return matchesSearchTerm && matchesDate;
  });

  const selectedAudios = filteredAudios.slice(startIndex, startIndex + audiosPerPage);

  return (
    <div className="mx-auto grid grid-cols-1 gap-6 h-full">
      <div className="flex flex-col p-6 shadow-md text-black rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Text to Speech</h1>
          <button
            onClick={() => setIsTextModalOpen(true)}
            className="bg-blue-700 text-white hover:text-white hover:bg-blue-700 font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            Generate
          </button>
        </div>

        <AudioFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <div className="bg-white p-6 rounded-lg shadow-md w-full mb-4 text-gray-900">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loadingAudios ? (
            <Loading />
          ) : filteredAudios.length === 0 ? (
            <div className="flex flex-col md:h-[70vh] items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
              <i className="fas fa-microphone-slash text-4xl text-gray-500 mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800">No Audios Found</h2>
              <p className="text-gray-500">Start by generating your first audio.</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {selectedAudios.map((audio) => (
                  <AudioCard
                    key={audio._id}
                    audio={audio}
                    onPlay={playAudio}
                    isPlaying={audioUrl === audio.presignedUrl}
                    audioUrl={audioUrl}
                  />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isTextModalOpen} onClose={() => setIsTextModalOpen(false)} title="Enter Text" customHeight="80vh">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-4 flex-grow">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Enter Title for the Audio</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              placeholder="Enter the title"
              required
            />
          </div>
          <div className="mb-4 flex-grow">
            <label htmlFor="text" className="block text-gray-700 font-bold mb-2">Enter Text To Generate Audio</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="shadow appearance-none border rounded w-full h-[80%] py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              placeholder="Type your text here..."
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none self-center mt-2"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Speech'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TextToSpeechForm;
