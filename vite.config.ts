import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import path from "path";
import "dotenv/config";
import bodyParser from "body-parser";
import { binanceProxyHandler, getSignature } from "./server/util";
import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    UnoCSS(),
    {
      name: 'server',
      configureServer(server) {
        const app = express();
        server.middlewares.use(app)
        app.use(bodyParser.json())

        app.use(
          "/proxy",
          createProxyMiddleware({
            target: "https://testnet.binance.vision/api/v3",
            changeOrigin: true,
            pathRewrite: {
              "^/proxy": "", // 把 /proxy 移除掉，讓它變成 /myTrades, /account
            },
            on:{
              proxyReq: binanceProxyHandler
            }
          })
        );
      }
    }
  ],
  // server: {
  //   proxy: {
  //     "/proxy": {
  //       // target: "https://testnet.binance.vision/api/v3",
  //       target: "http://localhost:3000/proxy",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/proxy/, ""),
  //     },
  //   },
  // },
});
