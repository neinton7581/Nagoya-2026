<script setup>
import { ref } from 'vue'
import DayCard from './DayCard.vue'

const days = ref([
  { id: 'day5', num: 'Day 5', title: '周邊一日遊', tags: [{ label: '自然', type: 'nature' }] },
  { id: 'day6', num: 'Day 6', title: 'TBD', tags: [] },
])
</script>

<template>
  <div class="section-header">
    <span class="section-num">03</span>
    <h2 class="section-title">Day 5–6</h2>
    <span class="section-range">TBD</span>
  </div>
  <div class="day-grid">
    <DayCard v-for="day in days" :key="day.id" :day="day" group="days-day5-6" />
  </div>
</template>
