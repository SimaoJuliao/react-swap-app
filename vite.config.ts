import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        // 👇 Gera bundle IIFE (compatível com WordPress)
        format: "iife",
        entryFileNames: "assets/index.[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
