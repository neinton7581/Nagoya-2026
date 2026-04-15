<script setup>
import { ref } from 'vue'
import DayCard from './DayCard.vue'

const days = ref([
  {
    id: 'day1', num: 'Day 1', title: '抵達名古屋', date: '8/22 六',
    tags: [{ label: '交通', type: 'transport' }],
    gradient: 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)',
    items: []
  },
  {
    id: 'day2', num: 'Day 2', title: 'TBD', date: '8/23 日',
    tags: [],
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
    items: []
  },
  {
    id: 'day3', num: 'Day 3', title: 'TBD', date: '8/24 一',
    tags: [],
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    items: []
  },
  {
    id: 'day4', num: 'Day 4', title: 'TBD', date: '8/25 二',
    tags: [],
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    items: []
  },
  {
    id: 'day5', num: 'Day 5', title: '回台灣', date: '8/26 三',
    tags: [{ label: '交通', type: 'transport' }],
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    items: []
  },
])
</script>

<template>
  <div style="padding: 0 1rem;">
    <div class="section-header-v2">
      <h2>行程總覽</h2>
      <span>8/22 – 8/26 · 名古屋</span>
    </div>
    <DayCard v-for="day in days" :key="day.id" :day="day" group="itinerary" />
  </div>
</template>
