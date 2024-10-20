import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { parseISO, format } from 'date-fns';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/v1/posts/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // 日付をフォーマット
    const formattedDate = format(parseISO(post.date), 'yyyy年MM月dd日');
    const formattedTime = format(parseISO(post.time), 'HH:mm');

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>日付: {formattedDate}</p>
            <p>時間: {formattedTime}</p>
            <p>場所: {post.location}</p>
        </div>
    );
};

export default PostDetail;