import React from 'react';
import { useLocation } from 'react-router-dom';
import './PostSuccess.css';

const PostSuccess = () => {
    const location = useLocation();
    const { state } = location;
    const { title, content, date, time, location: postLocation } = state || {};

    return (
        <div className="post-success-container">
            <h2>以下の内容で投稿を作成できました</h2>
            <div className="post-details">
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Content:</strong> {content}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Location:</strong> {postLocation}</p>
            </div>
        </div>
    );
};

export default PostSuccess;
