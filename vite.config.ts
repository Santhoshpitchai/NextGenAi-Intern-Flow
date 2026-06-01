import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss(), viteTsConfigPaths()],
  server: {
    proxy: {
      "/uploads": {
        target: process.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },

});
