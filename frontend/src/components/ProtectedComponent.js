import React from 'react';
import { Redirect } from 'react-router-dom';

const ProtectedComponent = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    isAuthenticated ? (
      <div>認証済みユーザーのみが見られるコンテンツです。</div>
    ) : (
      <Redirect to="/login" />
    )
  );
};

export default ProtectedComponent;
