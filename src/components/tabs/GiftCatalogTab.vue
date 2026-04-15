<script setup>
import { ref } from 'vue'

// Phase 4 將從 gifts.json 載入
const openGiftId = ref(null)
const gifts = ref([])  // 空陣列，Phase 4 填入名古屋伴手禮資料

function openGift(id) { openGiftId.value = id }
function closeGift() { openGiftId.value = null }
</script>

<template>
  <div class="section-header">
    <span class="section-num">07</span>
    <h2 class="section-title">伴手禮推薦</h2>
    <span class="section-range">名古屋 2026</span>
  </div>

  <div v-if="gifts.length === 0" style="text-align:center; padding:4rem 1rem; color:rgba(101,152,181,0.4);">
    <div style="font-size:2rem; margin-bottom:1rem;">🎁</div>
    <div style="font-size:0.85rem;">名古屋伴手禮推薦將在 Phase 4 新增</div>
  </div>

  <div v-else class="gift-grid">
    <div
      v-for="gift in gifts"
      :key="gift.id"
      class="gift-thumb"
      @click="openGift(gift.id)"
    >
      <img :src="gift.thumb" :alt="gift.name" loading="lazy">
      <div class="gift-thumb-name">{{ gift.name }}</div>
    </div>
  </div>

  <!-- Gift detail modal -->
  <teleport to="body">
    <div
      v-for="gift in gifts"
      :key="'modal-' + gift.id"
      class="gift-modal"
      :class="{ open: openGiftId === gift.id }"
      @click.self="closeGift"
    >
      <div class="gift-modal-card">
        <div class="gift-modal-header">
          <h3>{{ gift.name }}</h3>
          <button class="gift-modal-close" @click="closeGift">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <img :src="gift.image" :alt="gift.name" style="width:100%; border-radius:8px;">
        <div class="gift-modal-body" v-html="gift.description"></div>
      </div>
    </div>
  </teleport>
</template>
