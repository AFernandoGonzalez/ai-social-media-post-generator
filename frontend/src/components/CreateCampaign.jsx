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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Campaign</button>
        </form>
    );
};
