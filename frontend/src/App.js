import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/post/new">Create Post</Link></li>
                        <li><Link to="/posts">Post List</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/new" element={<PostForm />} />
                    <Route path="/post/success" element={<PostSuccess />} />
                    <Route path="/posts" element={<PostList />} />
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
