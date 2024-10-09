import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseISO, compareDesc } from 'date-fns';
import './FormStyles.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/v1/posts')
            .then(response => response.json())
            .then(data => {
                // created_atフィールドで降順にソート
                const sortedPosts = data.sort((a, b) => {
                    const dateA = parseISO(a.created_at); // ISO 8601形式の日時をパース
                    const dateB = parseISO(b.created_at);
                    return compareDesc(dateA, dateB); // 降順ソート
                });
                setPosts(sortedPosts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    const handleDelete = (postId) => {
        if (window.confirm('本当に削除しますか')) {
            fetch(`http://localhost:3000/v1/posts/${postId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => console.error('Error deleting post:', error));
        }
    };

    const handleEdit = (postId) => {
        navigate(`/post/edit/${postId}`);
    };

    useEffect(() => {
        // LINE Social Plugins のボタンをロード
        const script = document.createElement('script');
        script.src = "https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // LINEボタンの再レンダリングを強制的に行う
        script.onload = () => {
            if (window.LineIt) {
                window.LineIt.loadButton(); // LINEのボタンを強制ロード
            }
        };
    }, []);

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
                        {/* LINE公式の「LINEで送る」ボタン */}
                        <div className="line-it-button"
                            data-lang="ja"
                            data-type="share-a"
                            data-url={`${window.location.origin}/post/detail/${post.id}`}
                            data-color="default"
                            data-size="small"
                            data-count="true">
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;