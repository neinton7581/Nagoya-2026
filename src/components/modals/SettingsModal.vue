<script setup>
import { ref, watch, inject } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const openModal = inject('openModal', () => {})
const closeModal = inject('closeModal', () => {})

const rateInput = ref('0.215')
const geminiPlaceholder = ref('貼上 Gemini API Key')
const fbStatus = ref(null) // null = loading, false = not logged in, { email } = logged in
const fbEmail = ref('')
const fbPw = ref('')
const fbLoginError = ref('')
const fbLoginLoading = ref(false)

function loadRate() {
  const r = localStorage.getItem('nagoya_rate')
  if (r) rateInput.value = r
}
function saveRate() {
  localStorage.setItem('nagoya_rate', rateInput.value)
  if (typeof window.saveRate === 'function') window.saveRate()
}
function loadGeminiPlaceholder() {
  geminiPlaceholder.value = localStorage.getItem('gemini_api_key') ? 'Key 已設定 ✓' : '貼上 Gemini API Key'
}
const geminiInput = ref('')
function saveGeminiKey() {
  const val = geminiInput.value.trim(); if (!val) return
  localStorage.setItem('gemini_api_key', val)
  geminiInput.value = ''
  geminiPlaceholder.value = 'Key 已設定 ✓'
  alert('Gemini API Key 已儲存！')
}

function renderAuthStatus() {
  const isAuth = typeof window.fbGetAuthStatus === 'function' && window.fbGetAuthStatus()
  const email = typeof window.fbGetUserEmail === 'function' ? window.fbGetUserEmail() : null
  fbStatus.value = isAuth && email ? { email } : false
}

function fbLoginFromUI() {
  if (!fbEmail.value || !fbPw.value) { fbLoginError.value = '請填寫 Email 與密碼'; return }
  fbLoginLoading.value = true; fbLoginError.value = ''
  if (typeof window.fbLogin === 'function') window.fbLogin(fbEmail.value, fbPw.value)
}
function fbLogout() {
  if (typeof window.fbLogout === 'function') window.fbLogout()
  fbStatus.value = false
}

// 讓 Firebase 模組能觸發 UI 更新
window.renderFbAuthStatus = renderAuthStatus

function goToStats() {
  emit('close')
  setTimeout(() => openModal('statsModal'), 180)
}

watch(() => props.open, (val) => {
  if (val) { loadRate(); loadGeminiPlaceholder(); renderAuthStatus() }
})

function handleBg(e) { if (e.target.classList.contains('tool-modal')) emit('close') }
</script>

<template>
  <div class="tool-modal" :class="{ open }" @click="handleBg">
    <div class="tool-modal-card">
      <div class="tool-modal-header">
        <span class="tool-modal-title"><i class="fa-solid fa-gear"></i>Settings</span>
        <button class="tool-modal-close" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tool-modal-body settings-body">

        <!-- 雙機同步 -->
        <div class="settings-section">
          <div class="settings-section-title"><i class="fa-solid fa-cloud-arrow-up"></i> 雙機同步帳號</div>
          <div style="padding:0.5rem 1rem 0.8rem;">
            <template v-if="fbStatus === null">
              <div class="settings-hint" style="padding:0;">載入中…</div>
            </template>
            <template v-else-if="fbStatus && fbStatus.email">
              <div class="fb-auth-row">
                <i class="fa-solid fa-circle-check" style="color:#2d8a5a;font-size:0.9rem;flex-shrink:0;"></i>
                <span class="fb-auth-email">{{ fbStatus.email }}</span>
                <span class="fb-sync-badge">同步中</span>
              </div>
              <button class="fb-logout-btn" @click="fbLogout">
                <i class="fa-solid fa-right-from-bracket" style="margin-right:0.3rem;"></i>登出（停止雙機同步）
              </button>
            </template>
            <template v-else>
              <div class="fb-offline-note">登入後才會與另一支手機雙向同步，未登入時資料只存本機</div>
              <div class="fb-login-form">
                <input v-model="fbEmail" type="email" placeholder="帳號 Email" class="fb-login-input" autocomplete="username">
                <input v-model="fbPw" type="password" placeholder="密碼" class="fb-login-input" autocomplete="current-password" @keydown.enter="fbLoginFromUI">
                <div v-if="fbLoginError" class="fb-login-error">{{ fbLoginError }}</div>
                <button class="fb-login-btn" :disabled="fbLoginLoading" @click="fbLoginFromUI">
                  <i class="fa-solid fa-cloud-arrow-up" style="margin-right:0.3rem;"></i>
                  {{ fbLoginLoading ? '登入中…' : '登入並開啟同步' }}
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- 匯率 -->
        <div class="settings-section">
          <div class="settings-section-title"><i class="fa-solid fa-coins"></i> 匯率設定</div>
          <div class="settings-row">
            <span class="settings-label">日圓匯率</span>
            <input class="wallet-rate-input" v-model="rateInput" type="number" inputmode="decimal" min="0.01" step="0.001" @change="saveRate">
            <span class="settings-unit">TWD / ¥1 JPY</span>
          </div>
          <div class="settings-hint">計算機與記帳換算台幣時使用此匯率</div>
        </div>

        <!-- Gemini -->
        <div class="settings-section">
          <div class="settings-section-title"><i class="fa-solid fa-robot"></i> Gemini AI 設定</div>
          <div class="settings-row">
            <span class="settings-label">API Key</span>
            <input class="api-key-input" v-model="geminiInput" type="password" :placeholder="geminiPlaceholder" style="flex:1;min-width:0;">
            <button class="api-key-save" @click="saveGeminiKey">儲存</button>
          </div>
          <div class="settings-hint">用於掃描收據的 OCR 功能，Key 只儲存在本機裝置</div>
        </div>

        <!-- 統計 -->
        <div class="settings-section">
          <div class="settings-section-title"><i class="fa-solid fa-chart-pie"></i> 消費統計</div>
          <div class="settings-row" style="padding-bottom:0.8rem;">
            <button @click="goToStats" style="flex:1;background:rgba(224,123,57,0.1);border:1px solid rgba(224,123,57,0.3);border-radius:10px;color:#c96928;font-size:0.8rem;padding:0.55rem 1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.4rem;font-weight:600;">
              <i class="fa-solid fa-chart-pie"></i> 查看消費統計圖表
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
