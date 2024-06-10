import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import EditForm from './components/EditForm';
import './App.css';

const App = () => {
    return (
        <AuthProvider>
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
                        <Route path="/post/detail/:id" element={<PostDetail />} />
                        <Route path="/post/edit/:id" element={<EditForm />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

const Home = () => <div>Welcome to the Home Page</div>;

export default App;