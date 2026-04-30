import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: true,
    allowedHosts: [],
    proxy: {
      "/api": {
        target: "http://localhost:5194",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/")
          ) {
            return "react";
          }
          if (
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/react-router/")
          ) {
            return "router";
          }
        },
      },
    },
  },
});
