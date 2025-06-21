import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import path from "path";
import "dotenv/config";
import bodyParser from "body-parser";
import crypto from "crypto";

function getSignature(param: Record<string, any>): string {
  const params = new URLSearchParams();

  Object.entries(param).forEach(([key, value]) => {
    if (value != null) params.append(key, String(value));
  });

  const query = new URLSearchParams(params).toString(); // symbol=BTCUSDT&side=BUY&...
  // const signature = CryptoJS.HmacSHA256(query, process.env.SECRET_KEY || '').toString();
  // return `${query}&signature=${signature}`;
  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY || "")
    .update(query)
    .digest("hex");
  return `${query}&signature=${signature}`;
}

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
    // {
    //   name: "API_SIGN",
    //   configureServer(server) {
    //     server.middlewares.use(bodyParser.json());
    //     server.middlewares.use(async (req, res, next) => {
    //       const { method, url } = req;
    //       if (url?.includes("/proxy/")) {
    //         // 設定 JSON body parser

    //         if (method === "GET") {
    //           const fullUrl = new URL(`http://localhost${req.url}`);
    //           const params = Object.fromEntries(fullUrl.searchParams.entries());
    //           const signedQuery = getSignature(params);
    //           const endpoint = fullUrl.pathname.replace(/^\/proxy\//, "");

    //           // 拼接 Binance API URL
    //           const url = `https://testnet.binance.vision/api/v3/${endpoint}?${signedQuery}`;

    //           const response = await fetch(url, {
    //             headers: {
    //               "X-MBX-APIKEY": process.env.API_KEY || "",
    //             },
    //           });

    //           const data = await response.json();
    //           // 回傳結果給前端
    //           res.setHeader("Content-Type", "application/json");
    //           res.statusCode = response.status;
    //           res.end(JSON.stringify(data));
    //         }

    //         if (method === "POST") {
    //           const buffers: Uint8Array[] = [];
    //           for await (const chunk of req) {
    //             buffers.push(chunk);
    //           }
    //           console.log("buffers", buffers);
    //         }
    //       } else {
    //         next();
    //       }
    //     });
    //   },
    // },
  ],
  server: {
    proxy: {
      "/proxy": {
        target: "http://localhost:3000/proxy",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ""),
        headers: {
          "X-MBX-APIKEY": process.env.API_KEY || "",
        },
      },
    },
  },
});
