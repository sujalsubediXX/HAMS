import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],

  server: {
     host: true ,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ✅ your backend port
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error(`[proxy error] ${req.url}: ${err.message}`);
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
            }
            res.end(JSON.stringify({ error: 'Backend service is unavailable' }));
          });
        },
      },
    },
  },
})


