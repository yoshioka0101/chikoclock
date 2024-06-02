import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/v1/posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    const handleDelete = (postId) => {
        fetch(`http://localhost:3000/v1/posts/${postId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            setPosts(posts.filter(post => post.id !== postId));
        })
        .catch(error => console.error('Error deleting post:', error));
    };

    const handleEdit = (postId) => {
        // Editボタンがクリックされたときの処理を実装
    };

    return (
        <div className="post-list">
            <h2>Post List</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className="post">
                        <h3>
                            <Link to={`/post/detail/${post.id}`}>{post.title}</Link>
                        </h3>
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
