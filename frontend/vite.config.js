import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/health": "http://localhost:5000",
      "/ready": "http://localhost:5000",
      "/version": "http://localhost:5000"
    }
  }
});
