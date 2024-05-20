import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate フックをインポート
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function PostForm() {
    const [inputs, setInputs] = useState({ title: '', content: '' });
    const navigate = useNavigate(); // useNavigate フックを使用

    const handleChange = (name, event) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted with inputs:', JSON.stringify(inputs, null, 2));
        // フォームの入力フィールドをリセット
        setInputs({ title: '', content: '' });
        // ホームページにリダイレクト
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit}>
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
                <Grid item xs={12}>
                    <Box mt={2}>
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
        </form>
    );
}

export default PostForm;

