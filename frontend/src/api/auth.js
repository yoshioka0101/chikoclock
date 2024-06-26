import client from './client';
import Cookies from 'js-cookie';

// サインアップ
export const signUp = (params) => {
  return client.post('/auth', params); // confirm_success_url を追加
};

// サインイン
export const signIn = (params) => {
  return client.post('/auth/sign_in', params).then(response => {
    Cookies.set('_access_token', response.headers['access-token']);
    Cookies.set('_client', response.headers['client']);
    Cookies.set('_uid', response.headers['uid']);
    return response;
  });
};

// サインアウト
export const signOut = () => {
  return client.delete('/auth/sign_out', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  }).then(response => {
    Cookies.remove('_access_token');
    Cookies.remove('_client');
    Cookies.remove('_uid');
    return response;
  });
};

// ログインユーザーの取得
export const getCurrentUser = () => {
  if (
    !Cookies.get('_access_token') ||
    !Cookies.get('_client') ||
    !Cookies.get('_uid')
  )
    return;

  return client.get('/auth/sessions', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};