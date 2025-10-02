import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },

  base: "/",

  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
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
