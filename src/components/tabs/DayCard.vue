<script setup>
import { ref } from 'vue'

const props = defineProps({
  day: Object,   // { id, num, title, date, tags, items, gradient, photos }
  group: String,
})

const isOpen = ref(false)
const photoIdx = ref(0)
const NUM_SLIDES = 3  // placeholder slides until Phase 4 adds real photos
let touchStartX = 0

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) document.body.classList.add('day-card-open')
  else document.body.classList.remove('day-card-open')
}

function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (diff > 45 && photoIdx.value < NUM_SLIDES - 1) photoIdx.value++
  else if (diff < -45 && photoIdx.value > 0) photoIdx.value--
}

// Derive a lighter tint from the day gradient for slide 2/3
const slideGradients = [
  props.day.gradient || 'linear-gradient(135deg,#6b7280,#9ca3af)',
  (props.day.gradient || '').replace(/[\d.]+%/g, m => Math.min(100, parseFloat(m) + 15) + '%') || 'linear-gradient(135deg,#9ca3af,#6b7280)',
  'linear-gradient(160deg, rgba(0,0,0,0.15), rgba(0,0,0,0.05)),' + (props.day.gradient || 'linear-gradient(135deg,#6b7280,#9ca3af)'),
]
</script>

<template>
  <div class="day-card-v2">
    <!-- Photo / gradient header (swipeable) -->
    <div
      class="day-photo-wrap"
      @click="toggle"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div
        class="day-photo-slider"
        :style="{ transform: `translateX(-${photoIdx * 100}%)` }"
      >
        <div
          v-for="(g, i) in slideGradients"
          :key="i"
          class="day-photo-slide"
          :style="{ background: g }"
        ></div>
      </div>

      <!-- Date badge -->
      <div class="day-photo-date-badge">{{ day.date }}</div>

      <!-- Overlay text -->
      <div class="day-photo-overlay">
        <div class="day-photo-num">{{ day.num }}</div>
        <div class="day-photo-title">{{ day.title }}</div>
      </div>

      <!-- Dots -->
      <div class="day-photo-dots">
        <span v-for="i in NUM_SLIDES" :key="i" :class="{ active: photoIdx === i - 1 }"></span>
      </div>
    </div>

    <!-- Expand row -->
    <div class="day-expand-row" @click="toggle">
      <div class="day-expand-tags">
        <span
          v-for="tag in (day.tags || [])"
          :key="tag.label"
          class="day-expand-tag"
          :class="tag.type"
        >{{ tag.label }}</span>
        <span v-if="!day.tags?.length" class="day-expand-tag">🚧 行程規劃中</span>
      </div>
      <div class="day-expand-icon" :class="{ open: isOpen }">
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </div>

    <!-- Expandable itinerary -->
    <div class="day-body" :class="{ open: isOpen }">
      <div class="day-body-inner">
        <div class="timeline">
          <div v-if="!day.items || day.items.length === 0" class="t-item">
            <div class="t-time">—</div>
            <div class="t-title">🚧 行程規劃中</div>
            <div class="t-desc">此天行程將在 Phase 4 由 JSON 資料填入名古屋實際行程。</div>
          </div>
          <div v-for="item in (day.items || [])" :key="item.time" class="t-item">
            <div class="t-time">{{ item.time }}</div>
            <div class="t-title" v-html="item.title"></div>
            <div v-if="item.desc" class="t-desc" v-html="item.desc"></div>
            <div v-if="item.highlight" class="t-highlight" v-html="item.highlight"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
