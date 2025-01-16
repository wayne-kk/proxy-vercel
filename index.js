const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require('path')
const app = express();

// 配置代理，将请求转发到本地的 OpenWebUI 实例
const API_URL = "https://0bc1-123-120-255-251.ngrok-free.app/ngork"; // 替换为实际的 OpenWebUI 地址
// const API_URL = "https://js.design/"; // 替换为实际的 OpenWebUI 地址

// 启用 CORS 中间件
app.use(cors({
    origin: "*",  // 允许所有域访问，或者指定具体的域名
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // 允许的请求方法
    allowedHeaders: ["Content-Type", "Authorization"],  // 允许的请求头
  }));

  
// 中间件，动态重写路径，添加 /ngork 前缀
app.use((req, res, next) => {
    if (req.url.startsWith("/_app")) {
      req.url = `/ngork${req.url}`;
    }
    next();
  });
app.use(
"/ngork", 
express.static(path.join(__dirname, "build"))
);

app.use(
  "/ngork",
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    headers: {
    'Access-Control-Allow-Origin': '*', // 调试阶段开放跨域
    },
    pathRewrite: { "^/ngork": "" },
  })
);



// 健康检查
app.get("/", (req, res) => {
  res.send("OpenWebUI Vercel Proxy is Running!");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
