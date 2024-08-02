import React from 'react';
import { useParams } from 'react-router-dom';
import TopicDetails from '../components/TopicDetails';

const ContentPage = () => {
    const { id } = useParams();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Content Page</h1>
            <TopicDetails topicId={id} />
        </div>
    );
};

export default ContentPage;
