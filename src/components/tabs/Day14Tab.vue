<script setup>
import { ref } from 'vue'
import DayCard from './DayCard.vue'

// Phase 4 將從 JSON 載入實際名古屋行程
const days = ref([
  { id: 'day1', num: 'Day 1', title: '抵達名古屋', tags: [{ label: '交通', type: 'transport' }] },
  { id: 'day2', num: 'Day 2', title: '名古屋城 · 覺王山', tags: [{ label: '觀光', type: 'shop' }] },
  { id: 'day3', num: 'Day 3', title: '熱田神宮 · 大須', tags: [{ label: '美食', type: 'food' }] },
  { id: 'day4', num: 'Day 4', title: 'TBD', tags: [] },
])
</script>

<template>
  <div class="section-header">
    <span class="section-num">02</span>
    <h2 class="section-title">Day 1–4 · 名古屋</h2>
    <span class="section-range">TBD</span>
  </div>
  <div class="day-grid">
    <DayCard v-for="day in days" :key="day.id" :day="day" group="days-day1-4" />
  </div>
</template>
