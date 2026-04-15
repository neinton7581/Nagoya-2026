<script setup>
import DayMap from '../DayMap.vue'

defineProps({ day: Object })
defineEmits(['back'])
</script>

<template>
  <div class="dd-wrap">
    <!-- 頂部返回列 -->
    <div class="dd-topbar">
      <button class="dd-back-btn" @click="$emit('back')">
        <i class="fa-solid fa-chevron-left"></i>
        <span>行程總覽</span>
      </button>
    </div>

    <!-- 天數標題 -->
    <div class="dd-title-row">
      <span class="dd-hero-num">{{ day.num }}</span>
      <span class="dd-hero-date">{{ day.date }}</span>
      <h2 class="dd-hero-title">{{ day.title }}</h2>
    </div>

    <!-- 景點地圖 -->
    <div class="dd-section-label">景點地圖</div>
    <DayMap :spots="day.spots || []" />

    <!-- 行程 timeline -->
    <div class="dd-section-label" style="margin-top: 24px;">當天行程</div>
    <div class="timeline">
      <div v-if="!day.items || day.items.length === 0" class="t-item">
        <div class="t-time">—</div>
        <div class="t-title">🚧 行程規劃中</div>
        <div class="t-desc">此天的詳細行程將在後續填入。</div>
      </div>
      <div v-for="item in (day.items || [])" :key="item.time" class="t-item">
        <div class="t-time">{{ item.time }}</div>
        <div class="t-title" v-html="item.title"></div>
        <div v-if="item.desc" class="t-desc" v-html="item.desc"></div>
        <div v-if="item.highlight" class="t-highlight" v-html="item.highlight"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dd-wrap {
  padding: 0 1rem 3rem;
}

/* 返回按鈕列 */
.dd-topbar {
  padding: 8px 0 12px;
}
.dd-back-btn {
  background: none;
  border: none;
  padding: 6px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
  font-size: .9rem;
  -webkit-tap-highlight-color: transparent;
}
.dd-back-btn:active { opacity: .6; }

/* 天數標題列 */
.dd-title-row {
  margin-bottom: 18px;
}
.dd-hero-num {
  font-size: .72rem;
  color: #888;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-right: 8px;
}
.dd-hero-date {
  font-size: .72rem;
  color: #aaa;
}
.dd-hero-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 4px 0 0;
}

/* 區塊標籤 */
.dd-section-label {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 10px;
}
</style>
