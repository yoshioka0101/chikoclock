import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import EditForm from './components/EditForm';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ErrorHandler from './components/ErrorHandler';
import WeatherTable from './components/WeatherTable';
import { signOut } from './auth';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedArea, setSelectedArea] = useState('北海道');
    const [lines, setLines] = useState([]);
    const [message, setMessage] = useState('');
    const [trainError, setTrainError] = useState(null);
    const [weather, setWeather] = useState(null);

    // ログアウト処理
    const handleSignOut = () => {
        signOut();
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        alert('サインアウトしました');
    };

    // 選択したエリアの変更
    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value);
    };

    // 鉄道情報の取得
    const fetchTrainStatus = () => {
        fetch(`http://localhost:3000/v1/train_status?area=${selectedArea}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                    setLines([]);
                } else {
                    setMessage('');
                    setLines(data);
                }
                setTrainError(null);
            })
            .catch(error => {
                console.error('Error fetching train data:', error);
                setTrainError(error);
            });
    };

    // 天気情報の取得
    const fetchWeather = () => {
        fetch("http://localhost:3000/v1/weather")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setWeather(data.data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    };

    // 初期化処理
    useEffect(() => {
        fetchWeather();
        const user = localStorage.getItem('currentUser');
        if (user) {
            setIsLoggedIn(true);
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {isLoggedIn && <li><Link to="/post/new">新規作成</Link></li>}
                        {isLoggedIn && <li><Link to="/posts">投稿一覧</Link></li>}
                        {!isLoggedIn && <li><Link to="/login">ログイン</Link></li>}
                        {!isLoggedIn && <li><Link to="/signup">新規登録</Link></li>}
                        {isLoggedIn && (
                            <li>
                                <button onClick={handleSignOut}>ログアウト</button>
                            </li>
                        )}
                        {isLoggedIn && currentUser && (
                            <li><span>ログイン中: {currentUser.email}</span></li>
                        )}
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={
                        <div>
                            <h1>Welcome to the Home Page</h1>

                            {/* 鉄道運行状況 */}
                            <div>
                                <h2>列車の運行状況 ({selectedArea})</h2>
                                <form>
                                    <label>
                                        <input type="radio" value="北海道" checked={selectedArea === '北海道'} onChange={handleAreaChange} />
                                        北海道
                                    </label>
                                    <label>
                                        <input type="radio" value="東北" checked={selectedArea === '東北'} onChange={handleAreaChange} />
                                        東北
                                    </label>
                                    <label>
                                        <input type="radio" value="首都圏" checked={selectedArea === '首都圏'} onChange={handleAreaChange} />
                                        首都圏
                                    </label>
                                    <label>
                                        <input type="radio" value="中部" checked={selectedArea === '中部'} onChange={handleAreaChange} />
                                        中部
                                    </label>
                                    <label>
                                        <input type="radio" value="関西" checked={selectedArea === '関西'} onChange={handleAreaChange} />
                                        関西
                                    </label>
                                    <label>
                                        <input type="radio" value="中国" checked={selectedArea === '中国'} onChange={handleAreaChange} />
                                        中国
                                    </label>
                                    <label>
                                        <input type="radio" value="四国" checked={selectedArea === '四国'} onChange={handleAreaChange} />
                                        四国
                                    </label>
                                    <label>
                                        <input type="radio" value="九州" checked={selectedArea === '九州'} onChange={handleAreaChange} />
                                        九州
                                    </label>
                                </form>
                                <button onClick={fetchTrainStatus}>選択</button>
                                {trainError ? (
                                    <ErrorHandler error={trainError} />
                                ) : message ? (
                                    <p>{message}</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>路線</th>
                                                <th>状況</th>
                                                <th>詳細</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lines.map((line, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <a href={line.url} target="_blank" rel="noopener noreferrer">
                                                            {line.line}
                                                        </a>
                                                    </td>
                                                    <td>{line.status}</td>
                                                    <td>{line.details}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* 天気情報 */}
                            <WeatherTable weatherData={weather} selectedArea={selectedArea} />
                        </div>
                    } />
                    {isLoggedIn ? (
                        <>
                            <Route path="/post/new" element={<PostForm userId={currentUser?.id} />} />
                            <Route path="/posts" element={<PostList userId={currentUser?.id} />} />
                            <Route path="/post/detail/:id" element={<PostDetail />} />
                            <Route path="/post/edit/:id" element={<EditForm />} />
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} />
                            <Route path="/signup" element={<SignUpForm />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
