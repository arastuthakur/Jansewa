import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API || '';

  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API': JSON.stringify(geminiApiKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey)
    },
    server: {
      port: 3000,
      open: false
    },
    test: {
      globals: true,
      environment: 'jsdom',
      testTimeout: 25000
    }
  };
});
