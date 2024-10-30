import React from 'react';

const ErrorHandler = ({ error }) => {
    if (!error) return null;

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 400:
                return 'リクエストに不備があります。入力内容を確認してください。';
            case 403:
                return 'アクセス権限がありません。APIキーを確認してください。';
            case 408:
                return 'リクエストがタイムアウトしました。インターネット接続を確認して再試行してください。';
            case 429:
                return 'リクエストが多すぎます。しばらくしてから再度お試しください。';
            case 500:
                return 'サーバーエラーが発生しました。時間をおいて再度お試しください。';
            case 502:
                return 'サーバーが停止しているか、負荷が大きい可能性があります。再試行してください。';
            case 503:
                return '現在サービスを利用できません。後ほど再試行してください。';
            default:
                return '予期しないエラーが発生しました。時間をおいて再試行してください。';
        }
    };

    return (
        <div style={{ color: 'red', marginTop: '1em' }}>
            {getErrorMessage(error.code)}
        </div>
    );
};

export default ErrorHandler;
