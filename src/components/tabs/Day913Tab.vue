<script setup>
import { ref } from 'vue'
import DayCard from './DayCard.vue'

const days = ref([
  { id: 'day9',  num: 'Day 9',  title: 'TBD', tags: [] },
  { id: 'day10', num: 'Day 10', title: 'TBD', tags: [] },
  { id: 'day11', num: 'Day 11', title: 'TBD', tags: [] },
  { id: 'day12', num: 'Day 12', title: 'TBD', tags: [] },
  { id: 'day13', num: 'Day 13', title: '返程', tags: [{ label: '交通', type: 'transport' }] },
])
</script>

<template>
  <div class="section-header">
    <span class="section-num">05</span>
    <h2 class="section-title">Day 9–13</h2>
    <span class="section-range">TBD</span>
  </div>
  <div class="day-grid">
    <DayCard v-for="day in days" :key="day.id" :day="day" group="days-day9-13" />
  </div>
</template>
