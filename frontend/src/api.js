import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',  // 必要に応じてbaseURLを変更
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');  // ローカルストレージからトークンを取得
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;  // defaultエクスポートを追加
