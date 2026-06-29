import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vite';
import svgr from 'vite-plugin-svgr';

const API_DATA_PATH = path.resolve(__dirname, 'src/api/data.json');

const serveApiDataPlugin = (): Plugin => ({
  name: 'serve-api-data',
  configureServer(server) {
    server.middlewares.use('/api/data.json', (_req, res) => {
      const data = fs.readFileSync(API_DATA_PATH, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    });
  },
  closeBundle() {
    const distDir = path.resolve(__dirname, 'dist/api');
    fs.mkdirSync(distDir, { recursive: true });
    fs.copyFileSync(API_DATA_PATH, path.join(distDir, 'data.json'));
  },
});

export default defineConfig({
  plugins: [
    react(),
    serveApiDataPlugin(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
      },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
    watch: {
      ignored: ['**/node_modules/**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
