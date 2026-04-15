<script setup>
import { ref } from 'vue'
import DayImageCard from './DayImageCard.vue'
import DayDetailView from './DayDetailView.vue'

const days = ref([
  {
    id: 'day1', num: 'Day 1', title: '抵達名古屋', date: '8/22 六',
    tags: [{ label: '交通', type: 'transport' }],
    gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    image: null,
    items: [],
    spots: [],
  },
  {
    id: 'day2', num: 'Day 2', title: 'TBD', date: '8/23 日',
    tags: [],
    gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    image: null,
    items: [],
    spots: [],
  },
  {
    id: 'day3', num: 'Day 3', title: 'TBD', date: '8/24 一',
    tags: [],
    gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    image: null,
    items: [],
    spots: [],
  },
  {
    id: 'day4', num: 'Day 4', title: 'TBD', date: '8/25 二',
    tags: [],
    gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    image: null,
    items: [],
    spots: [],
  },
  {
    id: 'day5', num: 'Day 5', title: '回台灣', date: '8/26 三',
    tags: [{ label: '交通', type: 'transport' }],
    gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    image: null,
    items: [],
    spots: [],
  },
])

const selectedDay = ref(null)

function selectDay(day) {
  selectedDay.value = day
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function goBack() {
  selectedDay.value = null
  window.scrollTo({ top: 0, behavior: 'instant' })
}
</script>

<template>
  <!-- 行程總覽：圖片卡列表 -->
  <div v-if="!selectedDay" style="padding: 0 1rem;">
    <div class="section-header-v2">
      <h2>行程總覽</h2>
      <span>8/22 – 8/26 · 名古屋</span>
    </div>
    <DayImageCard
      v-for="day in days"
      :key="day.id"
      :day="day"
      @select="selectDay"
    />
  </div>

  <!-- 當天行程詳情：地圖 + timeline -->
  <DayDetailView
    v-else
    :day="selectedDay"
    @back="goBack"
  />
</template>
