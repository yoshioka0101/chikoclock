import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseISO, compareDesc, format } from 'date-fns';
import './FormStyles.css';
import LineShareButton from './LineShareButton'; // 別ファイルのLINEシェアボタンをインポート

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/v1/posts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('投稿データの取得に失敗しました。');
                }
                return response.json();
            })
            .then(data => {
                const sortedPosts = data.sort((a, b) => {
                    const dateA = parseISO(a.created_at);
                    const dateB = parseISO(b.created_at);
                    return compareDesc(dateA, dateB);
                });
                setPosts(sortedPosts);
            })
            .catch(error => setError(error.message));
    }, []);

    const handleDelete = (postId) => {
        if (window.confirm('本当に削除しますか？')) {
            fetch(`http://localhost:3000/v1/posts/${postId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('投稿の削除に失敗しました。');
                }
                return response.json();
            })
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => setError(error.message));
        }
    };

    const handleEdit = (postId) => {
        navigate(`/post/edit/${postId}`);
    };

    return (
        <div className="post-list">
            <h2>Post List</h2>

            {/* エラーメッセージの表示 */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {posts.map((post) => {
                    const formattedDate = format(parseISO(post.created_at), 'yyyy/MM/dd HH:mm');

                    return (
                        <li key={post.id} className="post">
                            <h3>
                                <Link to={`/post/detail/${post.id}`}>{post.title}</Link>
                            </h3>
                            <p><strong>Date:</strong> {formattedDate}</p>
                            <p><strong>Location:</strong> {post.location}</p>
                            <button className="edit-button" onClick={() => handleEdit(post.id)}>Edit</button>
                            <button onClick={() => handleDelete(post.id)}>Delete</button>

                            {/* LineShareButtonコンポーネントを使用 */}
                            <LineShareButton shareUrl={`${window.location.origin}/post/detail/${post.id}`} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PostList;