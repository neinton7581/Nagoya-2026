<script setup>
import { ref } from 'vue'
import DayCard from './DayCard.vue'

const days = ref([
  { id: 'day7', num: 'Day 7', title: 'TBD', tags: [] },
  { id: 'day8', num: 'Day 8', title: 'TBD', tags: [] },
])
</script>

<template>
  <div class="section-header">
    <span class="section-num">04</span>
    <h2 class="section-title">Day 7–8</h2>
    <span class="section-range">TBD</span>
  </div>
  <div class="day-grid">
    <DayCard v-for="day in days" :key="day.id" :day="day" group="days-day7-8" />
  </div>
</template>
