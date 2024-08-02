import React from 'react';
import { useParams } from 'react-router-dom';
import TopicDetails from '../components/TopicDetails';

const ContentPage = () => {
    const { id } = useParams();

    return (
        <div className="container mx-auto p-4">
            <TopicDetails topicId={id} />
        </div>
    );
};

export default ContentPage;
