<script setup>
import { ref } from 'vue'

// Phase 4 將從 vouchers.json 載入
const openDayId = ref(null)
const openItemIds = ref({})

const days = ref([
  { id: 'vd-01', label: 'Day 1 · 抵達', items: [] },
  { id: 'vd-02', label: 'Day 2 · TBD', items: [] },
])

function toggleDay(id) {
  openDayId.value = openDayId.value === id ? null : id
  openItemIds.value = {}
}
function toggleItem(id) {
  openItemIds.value[id] = !openItemIds.value[id]
}
</script>

<template>
  <div class="section-header">
    <span class="section-num">06</span>
    <h2 class="section-title">住宿 & 預約憑證</h2>
    <span class="section-range">名古屋旅遊 2026</span>
  </div>

  <div class="voucher-section">
    <div v-for="day in days" :key="day.id" class="voucher-day-wrap">
      <div
        class="voucher-day-label"
        :class="{ 'vd-open': openDayId === day.id }"
        @click="toggleDay(day.id)"
      >
        <span>{{ day.label }}</span>
        <span class="vd-arrow" :style="openDayId === day.id ? 'transform:rotate(180deg)' : ''">▾</span>
      </div>
      <div class="voucher-day-body" :class="{ open: openDayId === day.id }">
        <div v-if="!day.items || day.items.length === 0" style="padding:1rem; font-size:0.78rem; color:rgba(101,152,181,0.5); width:100%;">
          🚧 預約憑證將在 Phase 4 由 JSON 填入名古屋實際訂房與預約資料。
        </div>
        <div v-for="item in (day.items || [])" :key="item.id" class="voucher-item-wrap">
          <div class="voucher-item-label" @click="toggleItem(item.id)">{{ item.label }}</div>
          <div class="voucher-item-body" :class="{ open: openItemIds[item.id] }" v-html="item.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
