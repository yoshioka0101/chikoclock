import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import EditForm from './components/EditForm';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { getCurrentUser, signOut } from './api/auth';
import './App.css';

export const AuthContext = createContext();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res?.data.isLogin) {
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
      } else {
        setIsSignedIn(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error(error);
      setIsSignedIn(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSignedIn(false);
      setCurrentUser(null);
      alert('ログアウトしました');
    } catch (error) {
      console.error(error);
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, currentUser, handleSignOut }}>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/posts">Post List</Link></li>
              {isSignedIn ? (
                <>
                  <li><Link to="/post/new">Create Post</Link></li>
                  <li><button onClick={handleSignOut}>Sign Out</button></li>
                  <li>{currentUser && <span>{currentUser.email}</span>}</li>
                </>
              ) : (
                <>
                  <li><Link to="/signin">Sign In</Link></li>
                  <li><Link to="/signup">Sign Up</Link></li>
                </>
              )}
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/new" element={isSignedIn ? <PostForm /> : <Navigate to="/signin" />} />
            <Route path="/post/success" element={<PostSuccess />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/post/detail/:id" element={<PostDetail />} />
            <Route path="/post/edit/:id" element={isSignedIn ? <EditForm /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;