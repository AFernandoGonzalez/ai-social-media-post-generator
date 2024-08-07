import React, { useState, useEffect, useContext } from 'react';
import { saveTextAudio, updateAudioFileName, deleteAudio } from '../services/api';
import Modal from './Modal';
import Pagination from './Pagination';
import Loading from './Loading';
import { useAudio } from '../contexts/AudioContext';

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

  const { audios, saveAudio, updateAudio, removeAudio, loadAudios, loading: loadingAudios, totalPages } = useAudio();

  const audiosPerPage = 5;

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

  const startIndex = (currentPage - 1) * audiosPerPage;
  const selectedAudios = audios.slice(startIndex, startIndex + audiosPerPage);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 gap-6">
      <div className="flex flex-col">
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex">
            <h1 className="text-2xl font-bold mb-4 mr-6">Text to Speech Converter</h1>
            <button
              onClick={() => setIsTextModalOpen(true)}
              className="m-w-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Generate Speech
            </button>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
        <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Generated Audios</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loadingAudios ? (
            <Loading />
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="py-2 inline-block min-w-full">
                  <div className="overflow-hidden">
                    {audios.length === 0 ? (
                      <p className="text-center text-gray-500">No audios generated yet.</p>
                    ) : (
                      <table className="min-w-full text-left">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 border-b border-gray-200">#</th>
                            <th className="px-6 py-3 border-b border-gray-200">Title</th>
                            <th className="px-6 py-3 border-b border-gray-200">Audio</th>
                            <th className="px-6 py-3 border-b border-gray-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAudios.map((audio, index) => (
                            <tr key={audio._id} className="bg-white">
                              <td className="px-6 py-4 border-b border-gray-200">{startIndex + index + 1}</td>
                              <td className="px-6 py-4 border-b border-gray-200">{audio.title}</td>
                              <td className="px-6 py-4 border-b border-gray-200 w-full max-w-2xl mx-auto">
                                <audio controls className="w-full">
                                  <source src={audio.presignedUrl} type="audio/mp3" />
                                  Your browser does not support the audio element.
                                </audio>
                              </td>
                              <td className="px-6 py-4 border-b border-gray-200 flex gap-2">
                                <button
                                  onClick={() => startEditing(audio)}
                                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => startDeleting(audio._id)}
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
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
