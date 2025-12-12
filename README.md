# otomo - 全肯定応援団チャットボット

Anthropic Claude APIを使用した、主婦・育児中の母親向けの全肯定型チャットボットです。

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env`ファイルを作成し、以下の内容を追加してください：
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

3. 開発サーバーの起動
```bash
npm run dev
```

このコマンドで、Viteの開発サーバー（ポート5173）とExpressサーバー（ポート3000）が同時に起動します。

ブラウザで以下のURLにアクセスしてください：
- フロントエンド: http://localhost:5173

**注意**: `.env`ファイルに`ANTHROPIC_API_KEY`を設定してください。`.env.example`を参考にしてください。

## プロジェクト構成

- `src/App.vue` - チャットUI（Vue.js）
- `api/chat.js` - Anthropic API統合（Expressルートハンドラー）
- `server.js` - Expressサーバー
- `vite.config.js` - Vite設定

## 機能

- Claude 3 Sonnetモデルを使用した会話
- 「全肯定さん」としての応答生成
- 会話履歴の保持
- レスポンシブなUIデザイン

