import api from './api';

// サインアップ
export const signUp = async (email, password) => {
  const response = await api.post('/auth', { email, password });
  localStorage.setItem('authToken', response.data.token);  // トークンの保存
  return response.data;
};

// ログイン
export const signIn = async (email, password) => {
  const response = await api.post('/auth/sign_in', { email, password });
  localStorage.setItem('authToken', response.data.token);
  return response.data;
};

// ログアウト
export const signOut = async () => {
  await api.delete('/auth/sign_out');
  localStorage.removeItem('authToken');  // トークンの削除
};
