import React from 'react';
import { useLocation } from 'react-router-dom';
import './PostSuccess.css';

const PostSuccess = () => {
    const location = useLocation();
    const { state } = location;
    const { title, content, date, time, location: postLocation } = state || {};

    return (
        <div className="post-success-container"> {/* 追加 */}
            <h2>Post Successfully Created</h2>
            <div className="post-details"> {/* 追加 */}
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
