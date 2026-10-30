import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the export works from any folder, gateway subpath or static host.
export default defineConfig({
  base: './',
  plugins: [react()],
});
