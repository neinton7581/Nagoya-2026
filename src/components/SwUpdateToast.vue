<script setup>
import { ref, onMounted } from 'vue'

const show = ref(false)
let _swWaiting = null

function applyUpdate() {
  if (_swWaiting) _swWaiting.postMessage({ type: 'SKIP_WAITING' })
}

onMounted(() => {
  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            _swWaiting = newWorker
            show.value = true
          }
        })
      })
    }).catch(() => {})
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistration().then(reg => reg?.update()).catch(() => {})
    }
  })

  // iOS PWA 鍵盤彈出時 scroll input 到可視範圍
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
      }
    })
  }
})
</script>

<template>
  <div id="sw-update-toast" :class="{ show }">
    <span>✨ 有新版本可用</span>
    <button @click="applyUpdate">立即更新</button>
  </div>
</template>
