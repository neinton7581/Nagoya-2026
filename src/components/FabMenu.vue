<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'

const openModal = inject('openModal')
const fabOpen = ref(false)

function toggleFab() { fabOpen.value = !fabOpen.value }

function openTool(id) {
  fabOpen.value = false
  openModal(id)
}

function handleOutsideClick(e) {
  if (!fabOpen.value) return
  const wrap = document.getElementById('fabWrap')
  if (wrap && !wrap.contains(e.target)) fabOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('touchend', handleOutsideClick, { passive: true })
})
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('touchend', handleOutsideClick)
})
</script>

<template>
  <div class="fab-wrap" id="fabWrap">
    <div class="fab-menu" :class="{ open: fabOpen }">
      <button class="fab-item" @click="openTool('walletModal')">
        <i class="fa-solid fa-wallet"></i>Wallet
      </button>
      <button class="fab-item" @click="openTool('giftsModal')">
        <i class="fa-solid fa-gift"></i>Gifts
      </button>
      <button class="fab-item" @click="openTool('infoModal')">
        <i class="fa-solid fa-circle-info"></i>Info
      </button>
      <button class="fab-item" @click="openTool('listsModal')">
        <i class="fa-solid fa-list-check"></i>Lists
      </button>
      <button class="fab-item" @click="openTool('settingsModal')">
        <i class="fa-solid fa-gear"></i>Settings
      </button>
    </div>
    <button class="fab-main" :class="{ open: fabOpen }" @click="toggleFab">
      <span class="fab-fuji">
        <img src="/img/g37_94f2ec8f45.png" width="100" height="100" style="display:block;" alt="icon">
      </span>
      <i class="fa-solid fa-xmark fab-xmark"></i>
    </button>
  </div>
</template>
