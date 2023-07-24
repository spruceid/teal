import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const pwaOptions: Partial<VitePWAOptions> = {
  manifest: {
    name: 'teal',
    short_name: 'teal',
    description: 'teal | A Kepler Bluesky Web Client',
    theme_color: '#111',
    icons: [
      {
        src: '192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  registerType: 'prompt',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}']
  },
  devOptions: {
    enabled: false
  }
};

const replaceOptions = { __DATE__: new Date().toISOString() };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions), replace(replaceOptions)]
});
