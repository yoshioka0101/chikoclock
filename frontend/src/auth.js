import api from './api';

// サインアップ
export const signUp = async (email, password) => {
  const response = await api.post('/auth', { email, password });
  // サインアップ時には通常トークンは返されないが、APIの仕様に応じて保存
  if (response.headers['access-token']) {
    localStorage.setItem('access-token', response.headers['access-token']);
    localStorage.setItem('client', response.headers['client']);
    localStorage.setItem('uid', response.headers['uid']);
  }
  return response.data;
};

// ログイン
export const signIn = async (email, password) => {
  const response = await api.post('/auth/sign_in', { email, password });
  // トークン情報をローカルストレージに保存
  localStorage.setItem('access-token', response.headers['access-token']);
  localStorage.setItem('client', response.headers['client']);
  localStorage.setItem('uid', response.headers['uid']);
  return response.data;
};

// ログアウト
export const signOut = async () => {
  try {
    const response = await api.delete('/auth/sign_out', {
      headers: {
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }
    });

    // ローカルストレージから認証情報を削除
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
    
    alert('サインアウトしました');
    return response.data; // 成功レスポンスを返す
  } catch (error) {
    console.error('サインアウトに失敗しました', error);
    throw error; // エラーハンドリング用にエラーを投げる
  }
};