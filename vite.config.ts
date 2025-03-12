import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@page': path.resolve(__dirname, './src/page')
    }
  },
  server: {
    port: 5173,
    open: true,
  },
});
