# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

名古屋旅遊 PWA，使用 **Vue 3 + Vite + vite-plugin-pwa** 架構。

## 技術堆疊

| 工具 | 版本 | 用途 |
|------|------|------|
| pnpm | 10.x | 套件管理 |
| Vite | 6.x | 建置工具 |
| Vue 3 | 3.5.x | UI 框架（Composition API + `<script setup>`） |
| vite-plugin-pwa | 1.x | PWA / Service Worker 自動生成 |
| Firebase | 12.x | Auth + Firestore 即時同步 |

## 開發指令

```bash
pnpm dev        # 啟動開發伺服器（http://localhost:5173）
pnpm build      # 建置生產版本（輸出到 dist/）
pnpm preview    # 預覽生產建置
```

## 部署

- `git push` 到 `main` branch，GitHub Pages 自動從 `dist/` 部署。
- 需在 GitHub repo Settings → Pages 將 Source 設為 GitHub Actions 或指定 `dist/` 分支。

## 專案結構

```
├── public/              # 靜態資源（直接複製到 dist/）
│   ├── icon.png
│   ├── img/             # 行程圖片
│   └── pdf/             # 預約憑證 PDF
├── src/
│   ├── main.js          # 應用程式進入點
│   ├── App.vue          # 根組件（Tab 導覽、Modal 控制）
│   ├── components/      # 各功能組件
│   │   ├── days/        # 行程天數組件（DayCard.vue 等）
│   │   └── modals/      # 工具 Modal（Wallet.vue, Checklist.vue 等）
│   ├── composables/     # 可複用狀態邏輯
│   │   ├── useStorage.js    # localStorage / Firestore 統一介面
│   │   ├── useChecklist.js  # 行前清單狀態
│   │   ├── useLedger.js     # 記帳狀態
│   │   └── useFirebase.js   # Firebase Auth + Firestore 同步
│   ├── data/            # 靜態資料（JSON）
│   │   ├── itinerary.json   # 行程資料
│   │   ├── vouchers.json    # 預約憑證列表
│   │   └── gifts.json       # 伴手禮推薦列表
│   └── assets/          # 需經 Vite 處理的資源（CSS、字型等）
├── _legacy/             # 原始單檔版本（僅供參考，不參與建置）
│   ├── index.html
│   ├── sw.js
│   └── manifest.json
├── vite.config.js       # Vite + vite-plugin-pwa 設定
├── package.json
└── .npmrc               # pnpm build scripts 許可清單
```

## PWA 注意事項

- **無需手動維護 sw.js**：`vite-plugin-pwa` 在 `pnpm build` 時自動生成 Service Worker。
- **新增靜態資源**：將圖片放入 `public/img/`、PDF 放入 `public/pdf/`，`workbox.globPatterns` 自動納入快取，不需手動更新版本號。
- Service Worker 採用 `registerType: 'prompt'`，有新版本時顯示提示讓使用者手動更新。

## 資料持久化架構

### 狀態快取結構（`_cache`）

```js
{ cl: null, memo: null, ledger: null, gifts: null, wishlist: null, rate: null }
```

### 同步邏輯

- **未登入**：純 `localStorage`（key: `nagoya_cl`, `nagoya_memo`, `nagoya_ledger`, `nagoya_gifts`, `nagoya_wishlist`）
- **已登入**：Firestore `sync/{docKey}` collection，讀取優先用 `_cache`，寫入同步到 Firestore
- **`_migrateKey`**：登入後，只在 Firestore 無資料 **且 localStorage 有實際資料時** 才遷移（防止空陣列覆蓋 Firestore）

### 行前清單初始化

`initClData()` 使用 `localStorage.getItem('nagoya_cl_inited')` flag 判斷是否已初始化，避免 Firebase 返回空陣列時預設值不顯示。

## git 慣例

- commit message 用**中文**
- push 到 `main`
- 不需手動升 cache 版本號（vite-plugin-pwa 自動處理）

# currentDate
Today's date is 2026-04-14.
