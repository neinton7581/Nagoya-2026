<script setup>
import { inject } from 'vue'

const showTab = inject('showTab')
const activeTab = inject('activeTab')

const tabs = [
  { id: 'tab-overview',   label: '概覽',   icon: 'fa-house' },
  { id: 'tab-itinerary',  label: '行程',   icon: 'fa-calendar-days' },
  { id: 'tab-transport',  label: '憑證',   icon: 'fa-ticket' },
  { id: 'tab-dining',     label: '伴手禮', icon: 'fa-gift' },
]

function handleTabClick(id, e) {
  // 觸控設備用 touchend 處理，click 略過
  if (e.type === 'click' && 'ontouchstart' in window) return
  showTab(id)
}

let tStartY = 0
function onTouchStart(e) { tStartY = e.touches[0].clientY }
function onTouchEnd(e, id) {
  if (Math.abs(e.changedTouches[0].clientY - tStartY) > 8) return
  e.preventDefault()
  showTab(id)
}
</script>

<template>
  <nav class="nav-section">
    <div class="nav-inner">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-tab"
        :class="{ active: activeTab === tab.id }"
        @click="handleTabClick(tab.id, $event)"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd($event, tab.id)"
      >
        <i :class="'fa-solid ' + tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>
