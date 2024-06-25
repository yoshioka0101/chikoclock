import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function PostForm() {
    const [inputs, setInputs] = useState({ title: '', content: '', date: '', time: '', location: '' });
    const navigate = useNavigate();
    const autocompleteRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const handleChange = (name, event) => {
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: event.target.value,
        }));
    };

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            setInputs(prevInputs => ({
                ...prevInputs,
                location: place.formatted_address || place.name
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:3000/v1/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワークのレスポンスが良くありません。再度実行してください');
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submitted with inputs:', JSON.stringify(inputs, null, 2));
            setInputs({ title: '', content: '', date: '', time: '', location: '' });
            navigate('/post/success', { state: inputs });
            // 成功画面に遷移した後、1秒後にホームに自動的にリダイレクト
            setTimeout(() => {
                navigate('/');
            }, 1000); // 1000ミリ秒 = 1秒
        })
        .catch(error => {
            console.error('Error:', error);
            alert('フォームの送信にエラーが発生しました。もう一度やり直してください。');
        });
    };
    //暗黙的送信（Implicit submission）:https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
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
                            id="title"
                            value={inputs.title}
                            onChange={(e) => handleChange('title', e)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Content"
                            id="content"
                            multiline
                            rows={4}
                            value={inputs.content}
                            onChange={(e) => handleChange('content', e)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Date"
                            id="date"
                            type="date"
                            value={inputs.date}
                            onChange={(e) => handleChange('date', e)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Time"
                            id="time"
                            type="time"
                            value={inputs.time}
                            onChange={(e) => handleChange('time', e)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                       <Autocomplete
                            onLoad={(autocomplete) => autocompleteRef.current = autocomplete}
                            onPlaceChanged={handlePlaceChanged}
                        >
                            <TextField
                                label="Location"
                                id="location"
                                value={inputs.location}
                                onChange={(e) => handleChange('location', e)}
                                fullWidth
                            />
                        </Autocomplete>
                    </Grid>
                    <Grid item xs={12}>
                        <Box mt={2} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                endIcon={<SendIcon />}
                            >
                                CREATE
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default PostForm;