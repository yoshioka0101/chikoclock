import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function PostForm() {
    const [inputs, setInputs] = useState({ title: '', content: '', date: '', time: '', location: '' });
    const [marker, setMarker] = useState(null);
    const navigate = useNavigate();
    
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onMapClick = useCallback((event) => {
        setMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
        setInputs((prevInputs) => ({
            ...prevInputs,
            location: `${event.latLng.lat()}, ${event.latLng.lng()}`,
        }));
    }, []);

    const handleChange = (name, event) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted with inputs:', JSON.stringify(inputs, null, 2));
        setInputs({ title: '', content: '', date: '', time: '', location: '' });
        navigate('/');
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...リロードしてください</div>;

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
                        <Autocomplete>
                            <TextField
                                label="Location"
                                id="location"
                                value={inputs.location}
                                onChange={(e) => handleChange('location', e)}
                                fullWidth
                            />
                        </Autocomplete>
                        <div style={{ height: '400px', width: '100%', marginTop: '16px' }}>
                            <GoogleMap
                                mapContainerStyle={{ height: '100%', width: '100%' }}
                                zoom={8}
                                center={{ lat: -34.397, lng: 150.644 }}
                                onClick={onMapClick}
                            >
                                {marker && <Marker position={{ lat: marker.lat, lng: marker.lng }} />}
                            </GoogleMap>
                        </div>
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
