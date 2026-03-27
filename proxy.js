 import express from 'express';
 import { createProxyMiddleware } from 'http-proxy-middleware';

 const app = express();

 // kintoneのドメインを定義
 const kintoneDomain = 'https://2beamszqzu0n.cybozu.com';

 // CORS設定を追加
 app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*'); // 全てのオリジンを許可
     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Cybozu-API-Token');

     // OPTIONSメソッドに対するプレフライトリクエストに対応
     if (req.method === 'OPTIONS') {
         res.sendStatus(200);
     } else {
         next();
     }
 });

 // kintoneのAPIエンドポイントをプロキシする
 app.use('/kintone', createProxyMiddleware({
     target: kintoneDomain,
     changeOrigin: true,
     pathRewrite: {
         '^/kintone': '', // '/kintone'を削除してリクエストを転送
     },
     timeout: 5000, // タイムアウトを5秒に設定
     onProxyReq: (proxyReq, req, res) => {
         console.log('Proxying request to:', kintoneDomain);
         console.log('Request URL:', req.url);
     },
     onProxyRes: (proxyRes, req, res) => {
         console.log('Response status code:', proxyRes.statusCode);
     },
     onError: (err, req, res) => {
         console.error('Error occurred while proxying request:', err);
         res.status(500).send('Proxy error');
     }
 }));

 // プロキシサーバーを実行
 app.listen(3000, () => {
     console.log('Proxy server is running on http://localhost:3000');
 });
