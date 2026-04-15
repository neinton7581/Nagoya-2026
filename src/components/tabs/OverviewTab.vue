<script setup>
import { inject } from 'vue'
const showTab = inject('showTab')
const openModal = inject('openModal')

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
    <div class="ov-flight-card">
      <div class="ov-flight-route">
        <div class="ov-flight-airport">
          <div class="ov-flight-code">TPE</div>
          <div class="ov-flight-city">台灣 · 桃園</div>
        </div>
        <div class="ov-flight-middle">
          <div class="ov-flight-arc"></div>
          <i class="fa-solid fa-plane ov-flight-plane-icon"></i>
        </div>
        <div class="ov-flight-airport right">
          <div class="ov-flight-code">NGO</div>
          <div class="ov-flight-city">名古屋 · 中部</div>
        </div>
      </div>
      <div class="ov-flight-dates">
        <div class="ov-flight-date-chip">✈ 出發 8/22 六</div>
        <div class="ov-flight-date-chip">↩ 返回 8/26 三</div>
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
      <button class="ov-quick-btn" @click="showTab('tab-itinerary')">
        <i class="fa-solid fa-calendar-days"></i>
        <span>行程</span>
      </button>
      <button class="ov-quick-btn" @click="showTab('tab-transport')">
        <i class="fa-solid fa-ticket"></i>
        <span>憑證</span>
      </button>
      <button class="ov-quick-btn" @click="showTab('tab-dining')">
        <i class="fa-solid fa-gift"></i>
        <span>伴手禮</span>
      </button>
      <button class="ov-quick-btn accent" @click="openModal('walletModal')">
        <i class="fa-solid fa-wallet"></i>
        <span>Wallet</span>
      </button>
      <button class="ov-quick-btn" @click="openModal('listsModal')">
        <i class="fa-solid fa-list-check"></i>
        <span>Lists</span>
      </button>
      <button class="ov-quick-btn" @click="openModal('giftsModal')">
        <i class="fa-solid fa-bag-shopping"></i>
        <span>Gifts</span>
      </button>
    </div>
  </div>
</template>
