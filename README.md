# Chikoclock
## Dockerでのセットアップ手順
このプロジェクトは、Dockerを使用して簡単にセットアップできます。以下の手順に従って、開発環境を構築してください。

### 前提条件
- Dockerがインストールされていること
- Docker Composeがインストールされていること

### ステップ 1: リポジトリのクローン
既にリポジトリをクローンしている場合、このステップはスキップできます。

```sh
git clone https://github.com/yoshioka0101/chikoclock.git
cd chikoclock
```

### ステップ 2: フロントエンドのDockerイメージのビルドとコンテナの起動
フロントエンドのディレクトリに移動し、以下のコマンドを実行します。

```sh
cd frontend
docker-compose up --build
```

### ステップ 3: バックエンドのDockerイメージのビルドとコンテナの起動
プロジェクトのルートディレクトリに戻り、バックエンドのディレクトリに移動して以下のコマンドを実行します。

```sh
cd ../backend
docker-compose up --build -d
```

### ステップ 4: データベースのセットアップ
初回起動時にデータベースのセットアップを行う必要があります。以下のコマンドを実行してください。

```sh
docker-compose exec backend bin/rails db:setup
```

### ステップ 5: アプリケーションにアクセス
以下のURLにアクセスして、アプリケーションが正常に動作していることを確認します。

フロントエンド: http://localhost:3001
バックエンド: http://localhost:3000