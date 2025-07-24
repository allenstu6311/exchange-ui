// server.mjs
import express from "express";
import path, { resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import { binanceProxyHandler, getSignature } from "./util";
import bodyParser from "body-parser";

// === 模擬 __dirname（ES Module 沒有）===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// === 1. 設定靜態資源路徑 ===
const distPath = path.resolve(__dirname, "../dist");
app.use("/assets", express.static(resolve("../dist/assets")));

if (!fs.existsSync(distPath)) {
  console.error("❌ 找不到 dist/ 資料夾，請先執行 `npm run build`");
  process.exit(1);
}
app.use(express.static(distPath));
app.use(bodyParser.json());

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://testnet.binance.vision/api/v3",
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // 把 /proxy 移除掉，讓它變成 /myTrades, /account
    },
    on: {
      proxyReq: binanceProxyHandler
    },
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

// === 3. 啟動伺服器 ===
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
