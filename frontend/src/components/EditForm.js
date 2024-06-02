import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Box } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';



const EditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', content: '', date: '', time: '', location: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/v1/posts/${id}`)
            .then(response => response.json())
            .then(data => {
                setPost({
                    title: data.title,
                    content: data.content,
                    date: data.date,
                    time: data.time,
                    location: data.location
                });
                setLoading(false);
            })
            .catch(err => {
                console.log('Error loading the post:', err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/v1/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            navigate(`/post/detail/${id}`);
        })
        .catch(error => {
            console.error('Error updating post:', error);
            alert('エラーが発生しました。再試行してください。');
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            component="form"
            onSubmit={handleSubmit}
            p={3}
            border={1}
            borderRadius={4}
            boxShadow={3}
            maxWidth="600px"
            width="100%"
            bgcolor="background.paper"
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Content"
                        name="content"
                        multiline
                        rows={4}
                        value={post.content}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        value={post.date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Time"
                        name="time"
                        type="time"
                        value={post.time}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Location"
                        name="location"
                        value={post.location}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                    >
                        更新する
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditForm;
