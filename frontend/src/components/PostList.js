import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FormStyles.css';


const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/v1/posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    const handleDelete = (postId) => {
        if(window.confirm('本当に削除しますか')) {
            fetch(`http://localhost:3000/v1/posts/${postId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => console.error('Error deleting post:', error));
        }
    };

    const handleEdit = (postId) => {
        navigate(`/post/edit/${postId}`);
    };

    return (
        <div className="post-list">
            <h2>Post List</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className="post">
                        <h3>{post.title}</h3>
                        <p><strong>Date:</strong> {post.date}</p>
                        <p><strong>Time:</strong> {post.time}</p>
                        <p><strong>Location:</strong> {post.location}</p>
                        <button className="edit-button" onClick={() => handleEdit(post.id)}>Edit</button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;
