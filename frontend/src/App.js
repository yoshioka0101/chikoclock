import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import EditForm from './components/EditForm';
import SignIn from './components/SignIn';  // ログイン用コンポーネント
import SignUp from './components/SignUp';  // サインアップ用コンポーネント
import { getCurrentUser } from './api/auth';  // APIから現在のユーザー情報を取得
import './App.css';

// 認証コンテキストの作成
export const AuthContext = createContext();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // ログインしているユーザーの取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
      } else {
        console.log('No current user');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, []);

  // 認証が必要なルートのラッパーコンポーネント
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;  // ローディング中の表示
    }
    return isSignedIn ? children : <Navigate to="/signin" />;
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/post/new">Create Post</Link></li>
              <li><Link to="/posts">Post List</Link></li>
              {!isSignedIn && (
                <>
                  <li><Link to="/signin">Sign In</Link></li>
                  <li><Link to="/signup">Sign Up</Link></li>
                </>
              )}
            </ul>
          </nav>
          <Routes>
            {/* 認証が必要ないページ */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* 認証が必要なページ */}
            <Route
              path="/post/new"
              element={
                <PrivateRoute>
                  <PostForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/success"
              element={
                <PrivateRoute>
                  <PostSuccess />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <PrivateRoute>
                  <PostList />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/detail/:id"
              element={
                <PrivateRoute>
                  <PostDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/edit/:id"
              element={
                <PrivateRoute>
                  <EditForm />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

const Home = () => <div>Welcome to the Home Page</div>;

export default App;