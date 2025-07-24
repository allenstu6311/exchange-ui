# exchange-ui

一個以 React + TypeScript 開發的加密貨幣交易所前端介面，支援即時行情、K 線圖、深度圖、下單、成交列表等功能。
本專案適合用於學習交易所前端架構、圖表整合、WebSocket 即時資料處理等。

---

## 🚀 功能特色

- 即時行情顯示：支援多幣種報價、24小時漲跌幅
- K 線圖：整合 Lightweight Charts，顯示多種週期的 K 線
- 深度圖/委託簿：即時更新買賣掛單
- 下單表單：支援市價/限價單，含表單驗證
- 成交列表：顯示最新成交紀錄
- 多幣種切換：支援主流幣種查詢
- WebSocket 即時推送：行情、深度、成交等資料即時更新

---

## 📦 專案結構

```
exchange-ui/
  ├── public/                # 靜態資源
  ├── src/
  │   ├── api/               # API 請求與型別
  │   ├── components/        # React 元件（K線、深度、表單等）
  │   ├── hook/              # 自訂 hook
  │   ├── pages/             # 頁面組件（如 Home）
  │   ├── webSocket/         # WebSocket 服務
  │   ├── store/             # Redux 狀態管理
  │   ├── utils/             # 工具函式
  │   └── workers/           # Web Worker
  ├── server/                # 部屬用 proxy server
  ├── package.json
  └── README.md
```

---

## 🛠️ 安裝與啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 打包生產環境
npm run build
```

---

## ⚙️ 主要技術棧

- React 18
- TypeScript
- Redux Toolkit
- Vite
- Lightweight Charts
- Chakra UI
- WebSocket

---

## 📡 API 介接（以 Binance 為例）

| 功能         | 路徑範例                                               | 說明           |
|--------------|--------------------------------------------------------|----------------|
| 最新成交價   | `/api/v3/ticker/price?symbol=BTCUSDT`                  | 查詢即時價格   |
| K 線資料     | `/api/v3/klines?symbol=BTCUSDT&interval=1m`            | 查詢 K 線      |
| 深度資料     | `/api/v3/depth?symbol=BTCUSDT`                         | 查詢委託簿     |
| 24hr 行情    | `/api/v3/ticker/24hr?symbol=BTCUSDT`                   | 高低點/漲跌幅  |

---