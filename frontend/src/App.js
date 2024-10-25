import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostSuccess from './components/PostSuccess';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import EditForm from './components/EditForm';
import './App.css';

const App = () => {
    const [lines, setLines] = useState([]);
    const [message, setMessage] = useState('');  // メッセージ用
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState('北海道');  // デフォルトエリア

    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value);
    };

    const fetchTrainStatus = () => {
        // 選択された地域に応じてAPIを呼び出す
        fetch(`http://localhost:3000/v1/train_status?area=${selectedArea}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTPエラー: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                    setLines([]);  // 遅延情報がない場合は空に設定
                } else {
                    setMessage('');
                    setLines(data);  // 正常にデータがあればセット
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('現在データの取得に問題が生じております。再度お試しください。');
            });
    };

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
                    <Route path="/" element={
                        <div>
                            <h1>Welcome to the Home Page</h1>                                            
                            <div>
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
                            </div>
                            {error ? (  // エラーが発生した場合
                                <div>{error}</div>
                            ) : (
                                <div>
                                    <h2>列車の運行状況 ({selectedArea})</h2>
                                    {message ? (
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
                                                        <td>{line.line}</td>
                                                        <td>{line.status}</td>
                                                        <td>{line.details}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>
                    } />
                    <Route path="/post/new" element={<PostForm />} />
                    <Route path="/post/success" element={<PostSuccess />} />
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/post/detail/:id" element={<PostDetail />} />
                    <Route path="/post/edit/:id" element={<EditForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
