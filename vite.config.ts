import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port: 3000,
    strictPort: false,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
  // optimizeDeps: {
  //   exclude: ['lucide-react'],
  // },
})
