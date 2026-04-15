<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon path broken by Vite asset hashing
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps({
  spots: { type: Array, default: () => [] }, // [{ name, lat, lng }]
  defaultCenter: { type: Array, default: () => [35.1815, 136.9066] }, // 名古屋市中心
  defaultZoom: { type: Number, default: 13 },
})

const mapEl = ref(null)
let map = null

onMounted(() => {
  map = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView(props.defaultCenter, props.defaultZoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  const validSpots = props.spots.filter(s => s.lat && s.lng)

  validSpots.forEach((spot, i) => {
    const marker = L.marker([spot.lat, spot.lng]).addTo(map)
    marker.bindPopup(`<b>${i + 1}. ${spot.name}</b>`)
  })

  if (validSpots.length > 1) {
    map.fitBounds(L.latLngBounds(validSpots.map(s => [s.lat, s.lng])), { padding: [30, 30] })
  } else if (validSpots.length === 1) {
    map.setView([validSpots[0].lat, validSpots[0].lng], 15)
  }
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <div class="day-map-wrap">
    <div ref="mapEl" class="day-map-el"></div>
    <div v-if="!spots || spots.length === 0" class="day-map-empty">
      <i class="fa-solid fa-map-location-dot"></i>
      <span>景點位置規劃中</span>
    </div>
  </div>
</template>

<style scoped>
.day-map-wrap {
  position: relative;
  width: 100%;
  height: 230px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,.14);
}
.day-map-el {
  width: 100%;
  height: 100%;
}
.day-map-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f0f0f0;
  color: #aaa;
  font-size: .85rem;
  pointer-events: none;
  z-index: 500;
}
.day-map-empty i {
  font-size: 2rem;
  color: #ccc;
}
</style>
