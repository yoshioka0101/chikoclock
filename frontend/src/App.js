import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import EditForm from './components/EditForm';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { signOut } from './auth';
import './App.css';

const App = () => {
    const handleSignOut = () => {
        signOut();
        alert('サインアウトしました');
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/post/new">新規作成</Link></li>
                        <li><Link to="/posts">投稿一覧</Link></li>
                        <li><Link to="/login">ログイン</Link></li>
                        <li><Link to="/signup">新規登録</Link></li>
                        <li><button onClick={handleSignOut}>ログアウト</button></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/new" element={<PostForm />} />
                    <Route path="/post/success" element={<PostSuccess />} />
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/post/detail/:id" element={<PostDetail />} />
                    <Route path="/post/edit/:id" element={<EditForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignUpForm />} />
                </Routes>
            </div>
        </Router>
    );
};

const Home = () => <div>Welcome to the Home Page</div>;

export default App;