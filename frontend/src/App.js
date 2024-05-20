import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GoogleMapsSearch from './components/GoogleMapsSearch';
import PostForm from './components/PostForm';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/place">Place Search</Link></li>
                        <li><Link to="/post/new">Create Post</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/place" element={<GoogleMapsSearch />} />
                    <Route path="/post/new" element={<PostForm />} />
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
