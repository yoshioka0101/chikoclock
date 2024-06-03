# ベースイメージとしてNode.jsを使用
FROM node:16

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "start"]
