import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GoogleMapsSearch from './components/GoogleMapsSearch';
import PostForm from './components/PostForm';
import './App.css';

const App = () => {
    const [inputs, setInputs] = useState({ title: '', content: '' });

    const handleChange = (name, event) => {
        setInputs({ ...inputs, [name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(inputs)
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            alert('Post created successfully!');
            setInputs({ title: '', content: '' });
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        }
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Hello React</h1>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/place">Place Search</Link></li>
                            <li><Link to="/post/new">Create Post</Link></li>
                        </ul>
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/place" element={<GoogleMapsSearch />} />
                    <Route
                        path="/post/new"
                        element={
                            <PostForm
                                inputs={inputs}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

const Home = () => (
    <div>
        <h2>Welcome to the Home Page</h2>
        <p>This is the home page of our React app.</p>
    </div>
);

export default App;
