import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const isAuthenticated = localStorage.getItem('access-token'); // 認証状態を確認
    const location = useLocation();

    if (!isAuthenticated) {
        // 認証されていない場合はサインインページにリダイレクト
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    // 認証されている場合はコンテンツを表示
    return children;
};

export default RequireAuth;
