import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@shared": "../shared",
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://markode-ai-tool.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});