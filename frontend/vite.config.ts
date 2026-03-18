import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": backendUrl,
      "/ws": {
        target: backendUrl.replace("http", "ws"),
        ws: true,
      },
    },
  },
});
