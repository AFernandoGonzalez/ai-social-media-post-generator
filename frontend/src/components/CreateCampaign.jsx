import React, { useState } from 'react';

export const CreateCampaign = ({ onCreate }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });

            if (response.ok) {
                const data = await response.json();
                onCreate(data.campaign);
            } else {
                console.error('Failed to create campaign');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
                Create Campaign
            </button>
        </form>
    );
};
