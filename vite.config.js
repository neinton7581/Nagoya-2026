import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',          // 有新版時提示使用者，不自動更新
      injectRegister: 'auto',
      includeAssets: ['icon.png', 'img/**/*', 'pdf/**/*'],
      manifest: {
        name: '名古屋旅遊行程表',
        short_name: 'Nagoya Travel',
        description: '名古屋旅遊行程表 PWA',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        background_color: '#fff8ef',
        theme_color: '#fff8ef',
        lang: 'zh-TW',
        categories: ['travel', 'lifestyle'],
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // 自動預快取所有 build 輸出，以及 public/ 下的靜態資源
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,webp,svg,pdf}'],
        // 圖片與 PDF 採 CacheFirst，JS/CSS 採 StaleWhileRevalidate
        runtimeCaching: [
          {
            urlPattern: /\/img\/.+\.(png|jpg|jpeg|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nagoya-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\/pdf\/.+\.pdf$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nagoya-pdfs',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
