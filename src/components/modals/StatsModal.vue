<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

function getRate() { return parseFloat(localStorage.getItem('nagoya_rate') || '0.215') }
function getLedger() { try { return JSON.parse(localStorage.getItem('nagoya_ledger') || '[]') } catch { return [] } }
function itemToTwd(item, r) {
  if (item.currency === 'TWD') return item.amt || 0
  return Math.round((item.amt !== undefined ? item.amt : (item.jpy || 0)) * r)
}

const statsHtml = ref('')
let _catChart = null, _payChart = null

function renderStats() {
  const data = getLedger()
  const rate = getRate()
  const total = data.reduce((s, i) => s + itemToTwd(i, rate), 0)

  const catColors = ['#4a7c3f','#f28e2b','#e15759','#7ab47e','#59a14f','#edc948','#8b6355']
  const payColors = ['#4a7c3f','#f28e2b','#e15759','#7ab47e','#59a14f']

  const catMap = {}
  data.forEach(i => { catMap[i.cat] = (catMap[i.cat] || 0) + itemToTwd(i, rate) })
  const catEntries = Object.keys(catMap).map(k => ({ name: k, amt: catMap[k] })).sort((a, b) => b.amt - a.amt)

  const payMap = {}
  data.forEach(i => { const p = i.pay || '現金'; payMap[p] = (payMap[p] || 0) + itemToTwd(i, rate) })
  const payEntries = Object.keys(payMap).map(k => ({ name: k, amt: payMap[k] })).sort((a, b) => b.amt - a.amt)

  const top10 = data.slice().sort((a, b) => itemToTwd(b, rate) - itemToTwd(a, rate)).slice(0, 10)

  let html = `<div class="stats-card"><div class="stats-card-title">旅行總支出</div><div class="stats-total-num">NT$${total.toLocaleString()}</div><div class="stats-total-sub">${data.length} 筆</div></div>`
  html += `<div class="stats-card"><div class="stats-card-title">分類支出</div><div class="stats-chart-col"><div class="stats-chart-wrap"><canvas id="catChartCanvas"></canvas></div><div class="stats-legend" id="catLegend"></div></div></div>`
  html += `<div class="stats-card"><div class="stats-card-title">支付方式</div><div class="stats-chart-col"><div class="stats-chart-wrap"><canvas id="payChartCanvas"></canvas></div><div class="stats-legend" id="payLegend"></div></div></div>`
  html += `<div class="stats-card"><div class="stats-card-title">花費金額前十名</div>`
  top10.forEach((item, i) => {
    html += `<div class="stats-top-row"><span class="stats-top-rank">${i+1}</span><span class="stats-top-name">${item.name}</span><span class="stats-top-amt">NT$${itemToTwd(item, rate).toLocaleString()}</span></div>`
  })
  html += '</div>'
  statsHtml.value = html

  nextTick(() => {
    if (!window.Chart) return
    if (_catChart) _catChart.destroy()
    if (_payChart) _payChart.destroy()
    const catCanvas = document.getElementById('catChartCanvas')
    const payCanvas = document.getElementById('payChartCanvas')
    const catLegend = document.getElementById('catLegend')
    const payLegend = document.getElementById('payLegend')

    if (catCanvas && catEntries.length) {
      _catChart = new window.Chart(catCanvas, {
        type: 'doughnut',
        data: { labels: catEntries.map(e => e.name), datasets: [{ data: catEntries.map(e => e.amt), backgroundColor: catEntries.map((_, i) => catColors[i % catColors.length]), borderWidth: 2, borderColor: '#fff' }] },
        options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { display: false } }, animation: { duration: 400 } }
      })
      if (catLegend) catLegend.innerHTML = catEntries.map((e, i) => `<div class="stats-legend-item"><span class="stats-legend-dot" style="background:${catColors[i % catColors.length]}"></span><span>${e.name}</span><span class="stats-legend-amt">NT$${e.amt.toLocaleString()}</span></div>`).join('')
    }
    if (payCanvas && payEntries.length) {
      _payChart = new window.Chart(payCanvas, {
        type: 'doughnut',
        data: { labels: payEntries.map(e => e.name), datasets: [{ data: payEntries.map(e => e.amt), backgroundColor: payEntries.map((_, i) => payColors[i % payColors.length]), borderWidth: 2, borderColor: '#fff' }] },
        options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { display: false } }, animation: { duration: 400 } }
      })
      if (payLegend) payLegend.innerHTML = payEntries.map((e, i) => `<div class="stats-legend-item"><span class="stats-legend-dot" style="background:${payColors[i % payColors.length]}"></span><span>${e.name}</span><span class="stats-legend-amt">NT$${e.amt.toLocaleString()}</span></div>`).join('')
    }
  })
}

watch(() => props.open, (val) => { if (val) setTimeout(renderStats, 50) })
function handleBg(e) { if (e.target.classList.contains('tool-modal')) emit('close') }
</script>

<template>
  <div class="tool-modal" :class="{ open }" @click="handleBg">
    <div class="tool-modal-card">
      <div class="tool-modal-header">
        <span class="tool-modal-title"><i class="fa-solid fa-chart-pie"></i> 消費統計</span>
        <button class="tool-modal-close" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tool-modal-body stats-body" v-html="statsHtml"></div>
    </div>
  </div>
</template>
