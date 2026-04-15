<script setup>
import { ref, inject, watch, onMounted } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const openLightbox = inject('openLightbox', () => {})

// ── 匯率 ──
const rate = ref(0.215)
function loadRate() {
  const r = localStorage.getItem('nagoya_rate')
  if (r) rate.value = parseFloat(r)
}
function getRate() { return rate.value || 0.215 }

// ── Calculator ──
const calcExpr = ref('')
const calcResult = ref('¥ 0')
const calcTwd = ref('≈ NT$ 0')
let _calcVal = 0

function calcInput(ch) {
  if (ch === 'C') { calcExpr.value = ''; _calcVal = 0; updateCalcDisplay(); return }
  calcExpr.value += ch; updateCalcDisplay()
}
function calcBackspace() { calcExpr.value = calcExpr.value.slice(0, -1); updateCalcDisplay() }
function calcEqual() {
  try {
    const safe = calcExpr.value.replace(/[^0-9+\-*/().]/g,'')
    if (!safe) return
    _calcVal = (new Function('return (' + safe + ')'))()
    if (!isFinite(_calcVal)) _calcVal = 0
    calcResult.value = '¥ ' + Math.round(_calcVal).toLocaleString()
    calcTwd.value = '≈ NT$ ' + Math.round(_calcVal * getRate()).toLocaleString()
    calcExpr.value = ''
  } catch { calcResult.value = '計算錯誤' }
}
function useCalcInLedger() {
  if (calcExpr.value) {
    try { const safe = calcExpr.value.replace(/[^0-9+\-*/().]/g,''); if (safe) _calcVal = (new Function('return ('+safe+')'))() } catch {}
  }
  if (_calcVal && isFinite(_calcVal)) ledgerAmt.value = Math.round(_calcVal)
  _calcVal = 0; calcExpr.value = ''; updateCalcDisplay()
}
function updateCalcDisplay() {
  let tryVal = 0
  try { const safe = calcExpr.value.replace(/[^0-9+\-*/().]/g,''); if (safe) tryVal = (new Function('return ('+safe+')'))() } catch {}
  if (isFinite(tryVal) && tryVal) {
    calcResult.value = '¥ ' + Math.round(tryVal).toLocaleString()
    calcTwd.value = '≈ NT$ ' + Math.round(tryVal * getRate()).toLocaleString()
  } else { calcResult.value = '¥ 0'; calcTwd.value = '≈ NT$ 0' }
}

// ── Ledger ──
const ledgerDate = ref('8/22')
const ledgerCat = ref('吃吃喝喝')
const ledgerStore = ref('')
const ledgerName = ref('')
const ledgerAmt = ref('')
const ledgerPay = ref('現金')
const ledgerCurrency = ref('JPY')
const thumbPreview = ref(null)
let _pendingThumb = null

function toggleCurrency() {
  ledgerCurrency.value = ledgerCurrency.value === 'JPY' ? 'TWD' : 'JPY'
}

function getLedgerData() {
  try { return JSON.parse(localStorage.getItem('nagoya_ledger') || '[]') } catch { return [] }
}
function saveLedgerData(data) {
  localStorage.setItem('nagoya_ledger', JSON.stringify(data))
  if (typeof window.saveLedgerData === 'function') window.saveLedgerData(data)
}
function itemToTwd(item, r) {
  if (item.currency === 'TWD') return item.amt || 0
  return Math.round((item.amt !== undefined ? item.amt : (item.jpy || 0)) * r)
}

const ledgerItems = ref([])
const ledgerTotal = ref('合計 NT$0')
const ledgerGroups = ref([])

function renderLedger() {
  const data = getLedgerData()
  ledgerItems.value = data
  const r = getRate()
  const totalTwd = data.reduce((s, i) => s + itemToTwd(i, r), 0)
  ledgerTotal.value = '合計 NT$' + totalTwd.toLocaleString()

  // 按日期分組
  const dateMap = {}
  data.forEach(item => {
    const d = item.date || '未分類'
    if (!dateMap[d]) dateMap[d] = []
    dateMap[d].push(item)
  })
  ledgerGroups.value = Object.entries(dateMap).map(([date, items]) => ({
    date,
    items,
    subtotal: items.reduce((s, i) => s + itemToTwd(i, r), 0),
    collapsed: false,
  }))
}

function saveLedger() {
  const name = ledgerName.value.trim()
  const amt = parseFloat(ledgerAmt.value)
  if (!name || isNaN(amt) || amt === 0) { alert('請填寫品項與金額'); return }
  const data = getLedgerData()
  const entry = {
    name, store: ledgerStore.value.trim(), amt: Math.round(amt),
    currency: ledgerCurrency.value, date: ledgerDate.value,
    cat: ledgerCat.value, pay: ledgerPay.value,
    thumb: _pendingThumb || null, id: Date.now()
  }
  if (ledgerCurrency.value === 'JPY') entry.jpy = Math.round(amt)
  data.unshift(entry)
  saveLedgerData(data)
  ledgerName.value = ''; ledgerAmt.value = ''; ledgerStore.value = ''
  thumbPreview.value = null; _pendingThumb = null
  renderLedger()
}

function delLedger(id) {
  const data = getLedgerData().filter(i => i.id !== id)
  saveLedgerData(data); renderLedger()
}

function handlePhoto(e) {
  const file = e.target.files[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    const img = new Image()
    img.onload = () => {
      const MAX = 320; let w = img.width, h = img.height
      if (w > h) { if (w > MAX) { h = h*MAX/w; w = MAX } } else { if (h > MAX) { w = w*MAX/h; h = MAX } }
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(w); canvas.height = Math.round(h)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      _pendingThumb = canvas.toDataURL('image/jpeg', 0.72)
      thumbPreview.value = _pendingThumb
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

function handleScanReceipt(e) {
  const file = e.target.files[0]; if (!file) return
  e.target.value = ''
  if (typeof window.openReceiptOverlay === 'function') window.openReceiptOverlay(file)
  else alert('請稍候，掃描功能載入中')
}

watch(() => props.open, (val) => { if (val) { loadRate(); renderLedger() } })
onMounted(() => {
  loadRate(); renderLedger()
  window.nagoyaRenderLedger = renderLedger
})

function handleBg(e) { if (e.target.classList.contains('tool-modal')) emit('close') }
</script>

<template>
  <div class="tool-modal" :class="{ open }" @click="handleBg">
    <div class="tool-modal-card">
      <div class="tool-modal-header">
        <span class="tool-modal-title"><i class="fa-solid fa-wallet"></i>Wallet</span>
        <button class="tool-modal-close" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tool-modal-body" style="padding:0;display:flex;flex-direction:column;overflow:hidden;">
        <div class="wallet-split">

          <!-- 計算機 -->
          <div class="wallet-calc-pane">
            <div class="calc-display">
              <div class="calc-expr">{{ calcExpr || '—' }}</div>
              <div class="calc-result">{{ calcResult }}</div>
              <div class="calc-twd">{{ calcTwd }}</div>
            </div>
            <div class="calc-grid">
              <button class="calc-btn clr" @click="calcInput('C')">C</button>
              <button class="calc-btn op" @click="calcInput('(')">(</button>
              <button class="calc-btn op" @click="calcInput(')')">)</button>
              <button class="calc-btn op" @click="calcInput('/')">÷</button>
              <button class="calc-btn" @click="calcInput('7')">7</button>
              <button class="calc-btn" @click="calcInput('8')">8</button>
              <button class="calc-btn" @click="calcInput('9')">9</button>
              <button class="calc-btn op" @click="calcInput('*')">×</button>
              <button class="calc-btn" @click="calcInput('4')">4</button>
              <button class="calc-btn" @click="calcInput('5')">5</button>
              <button class="calc-btn" @click="calcInput('6')">6</button>
              <button class="calc-btn op" @click="calcInput('-')">−</button>
              <button class="calc-btn" @click="calcInput('1')">1</button>
              <button class="calc-btn" @click="calcInput('2')">2</button>
              <button class="calc-btn" @click="calcInput('3')">3</button>
              <button class="calc-btn op" @click="calcInput('+')">+</button>
              <button class="calc-btn" @click="calcInput('0')">0</button>
              <button class="calc-btn" @click="calcInput('00')">00</button>
              <button class="calc-btn op" @click="calcInput('.')">.</button>
              <button class="calc-btn eq" @click="calcEqual">=</button>
              <button class="calc-btn span2" @click="calcBackspace">⌫</button>
              <button class="calc-btn op span2" @click="useCalcInLedger"><i class="fa-solid fa-arrow-down"></i> 加入記帳</button>
            </div>
          </div>

          <!-- 記帳 -->
          <div class="wallet-ledger-pane">
            <div class="wallet-add-section" style="border-top:none;padding-top:0;margin-top:0;">
              <div class="wallet-add-title"><i class="fa-solid fa-pen-to-square"></i> 新增記帳</div>
              <div class="wallet-field-row">
                <select class="wallet-select" v-model="ledgerDate">
                  <option value="8/22">8/22 六</option>
                  <option value="8/23">8/23 日</option>
                  <option value="8/24">8/24 一</option>
                  <option value="8/25">8/25 二</option>
                  <option value="8/26">8/26 三</option>
                </select>
                <select class="wallet-select" v-model="ledgerCat">
                  <option>吃吃喝喝</option><option>交通</option>
                  <option>伴手禮</option><option>送自己的</option><option>住宿</option>
                </select>
              </div>
              <div class="wallet-field-row">
                <input class="wallet-input" v-model="ledgerStore" placeholder="店名（選填）" type="text">
              </div>
              <div class="wallet-field-row">
                <input class="wallet-input" v-model="ledgerName" placeholder="品項名稱" type="text">
              </div>
              <div class="wallet-field-row">
                <button class="currency-toggle-btn" :class="{ twd: ledgerCurrency==='TWD' }" @click="toggleCurrency">
                  {{ ledgerCurrency === 'JPY' ? '¥ JPY' : 'NT$ TWD' }}
                </button>
                <input class="wallet-input" v-model="ledgerAmt" :placeholder="ledgerCurrency==='JPY' ? '日幣金額 ¥' : '台幣金額 NT$'" type="number" inputmode="decimal" style="flex:1;">
                <img v-if="thumbPreview" class="wallet-thumb-preview" :src="thumbPreview" alt="預覽" @click="openLightbox(thumbPreview)">
              </div>
              <div class="wallet-field-row">
                <select class="wallet-select" v-model="ledgerPay">
                  <option value="現金">💴 現金</option>
                  <option value="信用卡">💳 信用卡</option>
                  <option value="Suica">🍉 Suica</option>
                  <option value="PayPay">📱 PayPay</option>
                  <option value="其他">💫 其他</option>
                </select>
              </div>
              <div class="wallet-field-row">
                <button class="wallet-photo-btn" @click="$refs.photoInput.click()">
                  <i class="fa-solid fa-camera"></i> 附圖
                </button>
                <button class="wallet-photo-btn" @click="$refs.scanInput.click()" style="margin-left:0.4rem;">
                  <i class="fa-solid fa-receipt"></i> 掃描收據
                </button>
                <input ref="photoInput" type="file" accept="image/*" capture="environment" style="display:none" @change="handlePhoto">
                <input ref="scanInput" type="file" accept="image/*" capture="environment" style="display:none" @change="handleScanReceipt">
              </div>
              <button class="wallet-save-btn" @click="saveLedger"><i class="fa-solid fa-floppy-disk"></i> 儲存記帳</button>
            </div>

            <!-- 記帳列表 -->
            <div class="wallet-ledger">
              <div class="ledger-header-row">
                <span class="ledger-title"><i class="fa-solid fa-receipt"></i> 消費記錄</span>
                <span class="ledger-total">{{ ledgerTotal }}</span>
              </div>
              <div v-if="ledgerGroups.length === 0" style="text-align:center;color:rgba(101,152,181,0.35);font-size:0.8rem;padding:2rem 0;">還沒有記帳項目</div>
              <div v-for="group in ledgerGroups" :key="group.date" class="ledger-date-group">
                <div class="ledger-date-header" @click="group.collapsed = !group.collapsed">
                  <span class="ledger-date-label">{{ group.date }}</span>
                  <span style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="ledger-date-subtotal">NT${{ group.subtotal.toLocaleString() }}</span>
                    <i class="fa-solid fa-chevron-down ledger-date-arrow"></i>
                  </span>
                </div>
                <div v-if="!group.collapsed" class="ledger-date-items">
                  <div v-for="item in group.items" :key="item.id" class="ledger-item">
                    <div style="flex:1;min-width:0;">
                      <div class="ledger-name">{{ item.name }}</div>
                      <div style="display:flex;gap:0.3rem;flex-wrap:wrap;">
                        <div v-if="item.cat" class="ledger-cat">{{ item.cat }}</div>
                        <div v-if="item.pay" class="ledger-cat" style="background:rgba(224,123,57,0.1);color:#c96928;">{{ item.pay }}</div>
                      </div>
                    </div>
                    <div class="ledger-amounts">
                      <div class="ledger-jpy">{{ item.currency !== 'TWD' ? '¥' + (item.jpy || item.amt || 0).toLocaleString() : '' }}</div>
                      <div class="ledger-twd">NT${{ itemToTwd(item, getRate()).toLocaleString() }}</div>
                    </div>
                    <img v-if="item.thumb" class="ledger-thumb" :src="item.thumb" alt="" @click="openLightbox(item.thumb)">
                    <button class="ledger-del" @click="delLedger(item.id)"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
