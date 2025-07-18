import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import path from "path";
import "dotenv/config";
import bodyParser from "body-parser";
import { getSignature } from "./server/util";
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
        server.middlewares.use(bodyParser.urlencoded({ extended: true }))
        server.middlewares.use('/proxy', createProxyMiddleware({
          target: "https://testnet.binance.vision/api/v3",
          changeOrigin: true,
          pathRewrite: { "^/proxy": "" },
          on: {
            proxyReq: (proxyReq, req: any, res) => {
              if (req.method !== 'GET') {
                const signedQuery = getSignature(req.body);
                proxyReq.setHeader("X-MBX-APIKEY", process.env.API_KEY || "");
                proxyReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
                proxyReq.setHeader("Content-Length", Buffer.byteLength(signedQuery));
                proxyReq.write(signedQuery);
                proxyReq.end();
              }
            },
          },
        }));

        app.use("/proxy", async (req, res, next) => {
          const { query, method, body } = req;
          if (method === "GET") {
            req.headers['X-MBX-APIKEY'] = process.env.API_KEY || '';
            const signedQuery = getSignature(query);
            req.url = `${req.path}?${signedQuery}`;
          }
          next();
        });
      }
    }
  ],
  // server: {
  //   proxy: {
  //     "/proxy": {
  //       // target: "https://testnet.binance.vision/api/v3",
  //       target: "http://localhost:5173/proxy",
  //       changeOrigin: true,
  //       // rewrite: (path) => path.replace(/^\/proxy/, ""),
  //     },
  //   },
  // },
});
