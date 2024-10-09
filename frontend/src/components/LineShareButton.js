
import React, { useEffect, useState } from 'react';

const LineShareButton = ({ shareUrl }) => {
    const [error, setError] = useState(null); // エラーメッセージの状態を管理

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.LineIt) {
                try {
                    window.LineIt.loadButton(); // LINEのボタンを初期化
                } catch (e) {
                    setError('LINEシェアボタンの初期化に失敗しました。');
                }
            }
        };

        script.onerror = () => {
            setError('LINEシェアボタンのスクリプトの読み込みに失敗しました。');
        };

        document.body.appendChild(script);

        // クリーンアップ処理
        return () => {
            document.body.removeChild(script);
        };
    }, [shareUrl]);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="line-it-button"
                data-lang="ja"
                data-type="share-a"
                data-url={shareUrl}
                data-color="default"
                data-size="large"
                data-count="false">
            </div>
        </div>
    );
};

export default LineShareButton;