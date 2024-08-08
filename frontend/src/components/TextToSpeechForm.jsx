import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Pagination from './Pagination';
import Loading from './Loading';
import { useAudio } from '../contexts/AudioContext';
import AudioCard from './AudioCard';

const TextToSpeechForm = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { audios, saveAudio, updateAudio, removeAudio, loadAudios, loading: loadingAudios } = useAudio();

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
      setIsTextModalOpen(false);
    } catch (err) {
      setError('Failed to generate speech');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAudio(editingId, newTitle);
      setEditingId(null);
      setNewTitle('');
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Failed to update file name');
    }
  };

  const handleDelete = async () => {
    try {
      await removeAudio(deleteId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Failed to delete audio');
    }
  };

  const startEditing = (audio) => {
    setEditingId(audio._id);
    setNewTitle(audio.title);
    setIsEditModalOpen(true);
  };

  const startDeleting = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const playAudio = (url) => {
    setAudioUrl(url);
  };

  const startIndex = (currentPage - 1) * audiosPerPage;
  const selectedAudios = audios.slice(startIndex, startIndex + audiosPerPage);

  return (
    <div className="container mx-auto  grid grid-cols-1 gap-6">
      <div className="flex flex-col bg-gradient-to-r from-blue-500 to-indigo-500 p-6 shadow-md text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Text to Speech</h1>
          <button
            onClick={() => setIsTextModalOpen(true)}
            className="bg-white text-blue-500 hover:text-white hover:bg-blue-700 font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:shadow-outline"
          >
            Generate Speech
          </button>
        </div>

        <div className="flex flex-col p-6 rounded-lg shadow-md text-gray-900 rounded-lg shadow-md w-full object-cover mb-4">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loadingAudios ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {audios.length === 0 ? (
                <p className="text-center text-gray-500">No audios generated yet.</p>
              ) : (
                selectedAudios.map((audio) => (
                  <AudioCard
                    key={audio._id}
                    audio={audio}
                    onPlay={playAudio}
                    onEdit={startEditing}
                    onDelete={startDeleting}
                    isPlaying={audioUrl === audio.presignedUrl}
                    audioUrl={audioUrl}
                  />
                ))
              )}
            </div>
          )}
          
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal isOpen={isTextModalOpen} onClose={() => setIsTextModalOpen(false)} title="Enter Text" customHeight="80vh">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-4 flex-grow">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Enter Title for the Audio
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter the title"
              required
            />
          </div>
          <div className="mb-4 flex-grow">
            <label htmlFor="text" className="block text-gray-700 font-bold mb-2">
              Enter Text To Generate Audio
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="shadow appearance-none border rounded w-full h-[80%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Type your text here..."
              required
            />
          </div>
          <div className="flex align-center justify-center">
            <button
              type="submit"
              className="flex justify-center mt-2 w-[300px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Speech'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Title" customHeight="30vh">
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="newTitle" className="block text-gray-700 font-bold mb-2">
              Enter New Title
            </label>
            <input
              id="newTitle"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter new title"
              required
            />
          </div>
          <div className="flex align-center justify-center mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewTitle('');
                setIsEditModalOpen(false);
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" customHeight="20vh">
        <div>
          <p className="text-gray-700 mb-4">Are you sure you want to delete this audio file?</p>
          <div className="flex align-center justify-center">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TextToSpeechForm;
