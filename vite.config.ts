import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import path from "path";
import "dotenv/config";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react(), UnoCSS()],
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
