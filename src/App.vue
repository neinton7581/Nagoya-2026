<script setup>
import { ref, provide, onMounted, nextTick } from 'vue'
import BottomNav from './components/BottomNav.vue'
import PhotoLightbox from './components/PhotoLightbox.vue'
import SwUpdateToast from './components/SwUpdateToast.vue'
import OverviewTab from './components/tabs/OverviewTab.vue'
import ItineraryTab from './components/tabs/ItineraryTab.vue'
import VoucherTab from './components/tabs/VoucherTab.vue'
import GiftCatalogTab from './components/tabs/GiftCatalogTab.vue'
import ListsModal from './components/modals/ListsModal.vue'
import InfoModal from './components/modals/InfoModal.vue'
import WalletModal from './components/modals/WalletModal.vue'
import StatsModal from './components/modals/StatsModal.vue'
import SettingsModal from './components/modals/SettingsModal.vue'
import GiftsTrackerModal from './components/modals/GiftsTrackerModal.vue'
import ReceiptOverlay from './components/modals/ReceiptOverlay.vue'

// ── Tab 狀態 ──
const activeTab = ref('tab-overview')
const DAY_TABS = ['tab-itinerary']

function setNavHeight() {
  const nav = document.querySelector('.nav-section')
  const navH = nav ? nav.getBoundingClientRect().height : 60
  document.documentElement.style.setProperty('--nav-height', navH + 'px')
  return navH
}

function showTab(tabId) {
  activeTab.value = tabId
  if (DAY_TABS.includes(tabId)) {
    document.body.classList.add('day-section-active')
    nextTick(() => setNavHeight())
  } else {
    document.body.classList.remove('day-section-active')
    document.body.classList.remove('day-card-open')
  }
  nextTick(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

// ── Modal 狀態 ──
const openModalId = ref(null)
let _scrollY = 0

function openModal(id) {
  _scrollY = window.scrollY
  document.body.classList.add('modal-open')
  document.body.style.top = '-' + _scrollY + 'px'
  openModalId.value = id
}

function closeModal() {
  openModalId.value = null
  document.body.classList.remove('modal-open')
  document.body.style.top = ''
  window.scrollTo(0, _scrollY)
}

// ── Lightbox ──
const lightboxSrc = ref('')
function openLightbox(src) { lightboxSrc.value = src }
function closeLightbox() { lightboxSrc.value = '' }

// ── Provide 給子組件 ──
provide('showTab', showTab)
provide('activeTab', activeTab)
provide('openModal', openModal)
provide('closeModal', closeModal)
provide('openModalId', openModalId)
provide('openLightbox', openLightbox)

// ── 初始化 ──
onMounted(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0, behavior: 'instant' })
  setNavHeight()
  window.addEventListener('resize', setNavHeight)
})
</script>

<template>
  <section class="flight-banner">
    <div class="flight-card">
      <span class="flight-label">Departure</span>
      <span class="flight-main">8/22</span>
      <span class="flight-sub">TPE→NGO</span>
    </div>
    <div class="flight-card">
      <span class="flight-label">Duration</span>
      <span class="flight-main">5 Days</span>
      <span class="flight-sub">六人同行</span>
    </div>
    <div class="flight-card">
      <span class="flight-label">Return</span>
      <span class="flight-main">8/26</span>
      <span class="flight-sub">NGO→TPE</span>
    </div>
  </section>

  <div class="main">
    <div id="tab-overview"   class="section-panel" :class="{ active: activeTab === 'tab-overview' }">
      <OverviewTab />
    </div>
    <div id="tab-itinerary" class="section-panel" :class="{ active: activeTab === 'tab-itinerary' }">
      <ItineraryTab />
    </div>
    <div id="tab-transport" class="section-panel" :class="{ active: activeTab === 'tab-transport' }">
      <VoucherTab />
    </div>
    <div id="tab-dining"    class="section-panel" :class="{ active: activeTab === 'tab-dining' }">
      <GiftCatalogTab />
    </div>
  </div>

  <BottomNav />
  <ListsModal       :open="['listsModal','memoModal','wishlistModal'].includes(openModalId)" :initial-tab="openModalId === 'wishlistModal' ? 'wishlist' : openModalId === 'memoModal' ? 'memo' : 'checklist'" @close="closeModal" />
  <InfoModal        :open="openModalId === 'infoModal'"     @close="closeModal" />
  <WalletModal      :open="openModalId === 'walletModal'"   @close="closeModal" />
  <StatsModal       :open="openModalId === 'statsModal'"    @close="closeModal" />
  <SettingsModal    :open="openModalId === 'settingsModal'" @close="closeModal" />
  <GiftsTrackerModal :open="openModalId === 'giftsModal'"  @close="closeModal" />
  <ReceiptOverlay />

  <PhotoLightbox :src="lightboxSrc" @close="closeLightbox" />
  <SwUpdateToast />
</template>
