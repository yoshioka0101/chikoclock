Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001'  # ReactアプリのURLを指定
    resource '*',
      headers: :any,
      expose: ['access-token', 'expiry', 'token-type', 'uid', 'client'],  # 認証トークンのヘッダーをexpose
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true  # クッキーや認証情報の送信を許可
  end
end