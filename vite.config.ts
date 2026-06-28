import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          storage: ['dexie', 'dexie-react-hooks', 'zod', 'date-fns'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
