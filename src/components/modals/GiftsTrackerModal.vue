<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const giftPerson = ref('')
const giftItem = ref('')
const giftsList = ref([])

function loadGifts() {
  try { giftsList.value = JSON.parse(localStorage.getItem('nagoya_gifts') || '[]') } catch { giftsList.value = [] }
}
function saveGifts() {
  localStorage.setItem('nagoya_gifts', JSON.stringify(giftsList.value))
  if (typeof window.saveGifts === 'function') window.saveGifts(giftsList.value)
}
function addGift() {
  if (!giftPerson.value.trim() || !giftItem.value.trim()) { alert('請填寫送給誰和禮物名稱'); return }
  giftsList.value.push({ person: giftPerson.value.trim(), gift: giftItem.value.trim(), id: Date.now() })
  saveGifts()
  giftPerson.value = ''; giftItem.value = ''
}
function delGift(id) {
  giftsList.value = giftsList.value.filter(i => i.id !== id)
  saveGifts()
}

watch(() => props.open, (val) => { if (val) loadGifts() })
function handleBg(e) { if (e.target.classList.contains('tool-modal')) emit('close') }
</script>

<template>
  <div class="tool-modal" :class="{ open }" @click="handleBg">
    <div class="tool-modal-card">
      <div class="tool-modal-header">
        <span class="tool-modal-title"><i class="fa-solid fa-gift"></i>Gifts</span>
        <button class="tool-modal-close" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tool-modal-body">
        <div class="gifts-add-row">
          <input class="wallet-input" v-model="giftPerson" placeholder="🙋 送給誰" type="text">
          <input class="wallet-input" v-model="giftItem" placeholder="🎁 禮物名稱" type="text" @keydown.enter="addGift">
          <button class="gifts-add-btn" @click="addGift"><i class="fa-solid fa-plus"></i> 新增</button>
        </div>
        <div v-if="giftsList.length === 0" class="gifts-empty">
          <i class="fa-regular fa-face-smile" style="font-size:1.5rem;display:block;margin-bottom:0.5rem;opacity:0.4;"></i>還沒有禮物清單
        </div>
        <template v-else>
          <div class="gifts-col-header">
            <span class="gifts-col-label">送給誰</span>
            <span class="gifts-col-label">禮物名稱</span>
            <span></span>
          </div>
          <div v-for="item in giftsList" :key="item.id" class="gift-record">
            <div class="gift-person">{{ item.person }}</div>
            <div class="gift-item-name">{{ item.gift }}</div>
            <button class="gift-del" @click="delGift(item.id)"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
