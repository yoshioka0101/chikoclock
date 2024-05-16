import React from 'react'; // Reactをインポート
import axios from 'axios'; // axiosをインポート
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [], // 空の初期値
            query: '', // 検索クエリ
            searchResults: [] // 検索結果
        };
    }

    componentDidMount() {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL, // APIのベースURL
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

    handleInputChange = (event) => {
        this.setState({ query: event.target.value });
    }

    searchPlaces = async () => {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL, // APIのベースURL
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json'
        });

        try {
            const response = await axiosInstance.get('/places/search', {
                params: { query: this.state.query }
            });
            this.setState({ searchResults: response.data.results });
        } catch (error) {
            console.error('Error fetching places data:', error);
        }
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
                    <h1>Place Search</h1>
                    <input 
                        type="text" 
                        value={this.state.query} 
                        onChange={this.handleInputChange} 
                        placeholder="Search places" 
                    />
                    <button onClick={this.searchPlaces}>Search</button>
                    <ul>
                        {this.state.searchResults.length > 0 ? (
                            this.state.searchResults.map(place => (
                                <li key={place.place_id}>{place.name}</li>
                            ))
                        ) : (
                            <li>No search results</li>
                        )}
                    </ul>
                </header>
            </div>
        );
    }
}

export default App;