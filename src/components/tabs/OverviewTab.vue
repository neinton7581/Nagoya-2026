<script setup>
import { inject } from 'vue'
const showTab = inject('showTab')
const openModal = inject('openModal')
const flightMapUrl = `url('${import.meta.env.BASE_URL}flight-map.png')`

const days = [
  { n: 1, label: '8/22' },
  { n: 2, label: '8/23' },
  { n: 3, label: '8/24' },
  { n: 4, label: '8/25' },
  { n: 5, label: '8/26' },
]
</script>

<template>
  <div class="ov-home">
    <!-- Top bar -->
    <div class="ov-top-bar">
      <span class="ov-top-logo">Nagoya 2026</span>
      <div class="ov-top-actions">
        <button class="ov-icon-btn" @click="openModal('infoModal')"><i class="fa-solid fa-circle-info"></i></button>
        <button class="ov-icon-btn" @click="openModal('settingsModal')"><i class="fa-solid fa-gear"></i></button>
      </div>
    </div>

    <!-- Flight route card -->
    <div class="ov-flight-card" :style="{ backgroundImage: flightMapUrl }">
      <div class="ov-flight-route">
        <div class="ov-flight-airport">
          <div class="ov-flight-code">TWN</div>
          <div class="ov-flight-city">臺灣</div>
        </div>
        <div class="ov-flight-airport">
          <div class="ov-flight-code">NGO</div>
          <div class="ov-flight-city">名古屋 · 中部</div>
        </div>
      </div>
    </div>

    <!-- Day selector -->
    <div class="ov-day-section-title">行程天數</div>
    <div class="ov-day-row">
      <button
        v-for="d in days"
        :key="d.n"
        class="ov-day-btn"
        @click="showTab('tab-itinerary')"
      >
        <span class="ov-day-label">Day</span>
        <span class="ov-day-circle">{{ d.n }}</span>
        <span class="ov-day-date-label">{{ d.label }}</span>
      </button>
    </div>

    <!-- Quick links -->
    <div class="ov-day-section-title">快速連結</div>
    <div class="ov-quick-grid">
      <button class="ov-quick-btn" @click="showTab('tab-transport')">
        <i class="fa-solid fa-ticket"></i>
        <span>預約憑證</span>
      </button>
      <button class="ov-quick-btn" @click="openModal('memoModal')">
        <i class="fa-solid fa-note-sticky"></i>
        <span>備忘錄</span>
      </button>
      <button class="ov-quick-btn" @click="showTab('tab-dining')">
        <i class="fa-solid fa-gift"></i>
        <span>伴手禮推薦</span>
      </button>
      <button class="ov-quick-btn" @click="openModal('giftsModal')">
        <i class="fa-solid fa-bag-shopping"></i>
        <span>送禮清單</span>
      </button>
      <button class="ov-quick-btn" @click="openModal('wishlistModal')">
        <i class="fa-solid fa-star"></i>
        <span>願望清單</span>
      </button>
      <button class="ov-quick-btn" @click="openModal('walletModal')">
        <i class="fa-solid fa-wallet"></i>
        <span>記帳</span>
      </button>
    </div>
  </div>
</template>
