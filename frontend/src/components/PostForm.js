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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // ロード状態
    const navigate = useNavigate();
    const autocompleteRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // 入力値のバリデーション関数
    const validateInputs = () => {
        let errors = {};
        if (!inputs.title) errors.title = 'タイトルは必須です';
        if (!inputs.content) errors.content = 'コンテンツは必須です';
        if (!inputs.date) errors.date = '日付は必須です';
        if (!inputs.time) errors.time = '時間は必須です';
        if (!inputs.location) errors.location = '場所は必須です';
        return errors;
    };

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
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true); // ロード開始
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
            setIsLoading(false); // ロード終了
            navigate('/post/success', { state: inputs });
            setTimeout(() => {
                navigate('/posts');
            }, 1000);
        })
        .catch(error => {
            console.error('Error:', error);
            setIsLoading(false); // ロード終了
            alert('フォームの送信にエラーが発生しました。もう一度やり直してください。');
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    // Google Maps APIの読み込みエラー時の処理
    if (loadError) return <div>Google Mapsの読み込みに失敗しました。後でもう一度お試しください。</div>;
    if (!isLoaded) return <div>Google Mapsを読み込んでいます...</div>;

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
                            error={!!errors.title}
                            helperText={errors.title}
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
                            error={!!errors.content}
                            helperText={errors.content}
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
                            error={!!errors.date}
                            helperText={errors.date}
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
                            error={!!errors.time}
                            helperText={errors.time}
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
                                error={!!errors.location}
                                helperText={errors.location}
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
                                disabled={isLoading} // 送信中はボタンを無効化
                            >
                                {isLoading ? '送信中...' : 'CREATE'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default PostForm;