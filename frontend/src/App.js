import React from 'react'; // Reactをインポート
import axios from 'axios'; // axiosをインポート
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [] //空の初期値
        };
    }

    componentDidMount() {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_DEV_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json'
        });

        axiosInstance.get('/posts')
            .then(results => {
                console.log(results);
                this.setState({
                    posts: results.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1>Hello React</h1>
                    <h1>Posts</h1>
                    <ul>
                        {this.state.posts.length > 0 ? (
                            this.state.posts.map(post => (
                                <li key={post.id}>{post.title}</li>
                            ))
                        ) : (
                            <li>No posts available</li>
                        )}
                    </ul>
                </header>
            </div>
        );
    }
}

export default App;