<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

// ── Lists Tab ──
const activeListTab = ref('memo')
function switchListsTab(name) { activeListTab.value = name }

// ── Util ──
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
const URL_RE = /(https?:\/\/[^\s]+)/g
function linkify(text) {
  return escHtml(text).replace(URL_RE, (url) => {
    const raw = url.replace(/&amp;/g,'&')
    return `<a href="${raw}" target="_blank"><i class="fa-solid fa-link"></i> ${raw.length > 40 ? raw.slice(0,37)+'…' : raw}</a>`
  })
}

// ── Memo ──
const memoList = ref([])
const memoInput = ref('')
function loadMemo() {
  try { memoList.value = JSON.parse(localStorage.getItem('nagoya_memo') || '[]') } catch { memoList.value = [] }
}
function saveMemo() { localStorage.setItem('nagoya_memo', JSON.stringify(memoList.value)) }
function addMemo() {
  const t = memoInput.value.trim(); if (!t) return
  memoList.value.unshift({ text: t }); saveMemo(); memoInput.value = ''
}
function delMemo(i) { memoList.value.splice(i, 1); saveMemo() }

// ── Checklist ──
const DEFAULT_CL = [
  { cat: '🛂 證件 & 票務', items: ['護照（有效期 6 個月以上）', '機票電子票根', '各訂房確認信'] },
  { cat: '💳 金融 & 通訊', items: ['日幣現金 ¥30,000–50,000', '信用卡（Visa / JCB）', 'eSIM / SIM 卡啟用'] },
  { cat: '🧳 行李', items: ['托運行李 ≤ 23kg', '充電器 & 轉接頭', '常備藥物'] },
  { cat: '📱 App & 預約', items: ['Google Maps 離線地圖下載', '餐廳預約確認'] },
]
const clItems = ref([])
const clProgress = ref('0 / 0 完成')
const clInput = ref('')
const clCat = ref('🧳 行李準備')

function loadCl() {
  const inited = localStorage.getItem('nagoya_cl_inited')
  let d = null
  try { d = JSON.parse(localStorage.getItem('nagoya_cl') || 'null') } catch {}
  if ((!d || d.length === 0) && !inited) {
    const items = []
    DEFAULT_CL.forEach(g => g.items.forEach(text => {
      items.push({ text, cat: g.cat, done: false, id: Date.now() + Math.random() })
    }))
    clItems.value = items
    localStorage.setItem('nagoya_cl', JSON.stringify(items))
    localStorage.setItem('nagoya_cl_inited', '1')
  } else {
    clItems.value = d || []
    if (d && d.length > 0 && !inited) localStorage.setItem('nagoya_cl_inited', '1')
  }
  updateClProgress()
}
function saveCl() {
  localStorage.setItem('nagoya_cl', JSON.stringify(clItems.value))
  updateClProgress()
  // Firebase sync (if logged in) handled by useFirebase composable (Phase 3)
  if (typeof window.saveClData === 'function') window.saveClData(clItems.value)
}
function updateClProgress() {
  const total = clItems.value.length
  const done = clItems.value.filter(i => i.done).length
  clProgress.value = `${done} / ${total} 完成`
}
function toggleCl(id) {
  const item = clItems.value.find(i => String(i.id) === String(id))
  if (item) { item.done = !item.done; saveCl() }
}
function delCl(id) {
  clItems.value = clItems.value.filter(i => String(i.id) !== String(id)); saveCl()
}
function addClItem() {
  const text = clInput.value.trim(); if (!text) return
  clItems.value.push({ text, cat: clCat.value, done: false, id: Date.now() + Math.random() })
  saveCl(); clInput.value = ''
}

// 依 cat 分組
const clGroups = ref({})
watch(clItems, () => {
  const g = {}
  clItems.value.forEach(item => {
    if (!g[item.cat]) g[item.cat] = []
    g[item.cat].push(item)
  })
  clGroups.value = g
}, { immediate: true, deep: true })

// ── Wishlist ──
const wlItems = ref([])
const wlName = ref(''), wlPrice = ref(''), wlWhere = ref('')
function loadWl() {
  try { wlItems.value = JSON.parse(localStorage.getItem('nagoya_wishlist') || '[]') } catch { wlItems.value = [] }
}
function saveWl() {
  localStorage.setItem('nagoya_wishlist', JSON.stringify(wlItems.value))
  if (typeof window.saveWlData === 'function') window.saveWlData(wlItems.value)
}
function addWl() {
  if (!wlName.value.trim()) return
  wlItems.value.push({ name: wlName.value.trim(), price: wlPrice.value.trim(), where: wlWhere.value.trim() })
  saveWl(); wlName.value = ''; wlPrice.value = ''; wlWhere.value = ''
}
function delWl(i) { wlItems.value.splice(i, 1); saveWl() }

watch(() => props.open, (val) => {
  if (val) { loadMemo(); loadCl(); loadWl() }
})
onMounted(() => { loadMemo(); loadCl(); loadWl() })

function handleBgClick(e) {
  if (e.target.classList.contains('tool-modal')) emit('close')
}
</script>

<template>
  <div class="tool-modal" :class="{ open }" @click="handleBgClick">
    <div class="tool-modal-card">
      <div class="tool-modal-header">
        <span class="tool-modal-title"><i class="fa-solid fa-list-check"></i>Lists</span>
        <button class="tool-modal-close" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tool-modal-body">
        <div class="lists-tabs">
          <button class="lists-tab-btn" :class="{ active: activeListTab==='memo' }" @click="switchListsTab('memo')">
            <i class="fa-solid fa-note-sticky"></i> 備忘錄
          </button>
          <button class="lists-tab-btn" :class="{ active: activeListTab==='checklist' }" @click="switchListsTab('checklist')">
            <i class="fa-solid fa-square-check"></i> 行前清單
          </button>
          <button class="lists-tab-btn" :class="{ active: activeListTab==='wishlist' }" @click="switchListsTab('wishlist')">
            <i class="fa-solid fa-star"></i> 願望清單
          </button>
        </div>

        <!-- Memo pane -->
        <div class="lists-pane" :class="{ active: activeListTab==='memo' }">
          <div v-if="memoList.length === 0" style="text-align:center;color:rgba(101,152,181,0.35);font-size:0.8rem;padding:2rem 0;">備忘錄空空的～</div>
          <div v-for="(item, idx) in memoList" :key="idx" class="memo-item">
            <button class="memo-del" @click="delMemo(idx)"><i class="fa-solid fa-xmark"></i></button>
            <span v-html="linkify(item.text)"></span>
          </div>
          <div class="memo-add-area">
            <textarea class="memo-input" v-model="memoInput" placeholder="輸入文字或網址…" rows="2"></textarea>
            <button class="memo-add-btn" @click="addMemo"><i class="fa-solid fa-plus"></i> 新增</button>
          </div>
        </div>

        <!-- Checklist pane -->
        <div class="lists-pane" :class="{ active: activeListTab==='checklist' }">
          <div class="cl-progress">{{ clProgress }}</div>
          <div v-for="(items, cat) in clGroups" :key="cat">
            <div class="cl-group-title">{{ cat }}</div>
            <div v-for="item in items" :key="item.id" class="cl-item-row" @click="toggleCl(item.id)">
              <div class="cl-checkbox" :class="{ checked: item.done }"></div>
              <span class="cl-item-text" :class="{ done: item.done }">{{ item.text }}</span>
              <button class="cl-del-btn" @click.stop="delCl(item.id)"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>
          <div class="cl-add-row" style="flex-wrap:wrap; gap:0.4rem;">
            <input class="cl-add-input" v-model="clInput" placeholder="新增項目…" style="min-width:0; flex:1 1 60%;" @keydown.enter="addClItem">
            <select class="cl-cat-select" v-model="clCat">
              <option>🧳 行李準備</option>
              <option>📋 出發前確認</option>
              <option>💳 金融 &amp; 票券</option>
              <option>📱 App &amp; 預訂</option>
              <option>🏥 健康 &amp; 安全</option>
              <option>✏️ 自訂</option>
            </select>
            <button class="cl-add-btn" @click="addClItem" style="flex:0 0 auto;"><i class="fa-solid fa-plus"></i> 新增</button>
          </div>
        </div>

        <!-- Wishlist pane -->
        <div class="lists-pane" :class="{ active: activeListTab==='wishlist' }">
          <div v-if="wlItems.length === 0" class="wl-empty">
            <i class="fa-regular fa-star" style="font-size:1.4rem;display:block;margin-bottom:0.5rem;opacity:0.4;"></i>還沒有願望清單
          </div>
          <table v-else class="wl-table">
            <thead><tr><th>品項</th><th>預期價格</th><th>哪裡買</th><th></th></tr></thead>
            <tbody>
              <tr v-for="(item, i) in wlItems" :key="i">
                <td>{{ item.name }}</td>
                <td class="wl-price">{{ item.price || '—' }}</td>
                <td class="wl-where">{{ item.where || '—' }}</td>
                <td><button class="wl-del-btn" @click="delWl(i)"><i class="fa-solid fa-xmark"></i></button></td>
              </tr>
            </tbody>
          </table>
          <div class="wl-add-row">
            <input class="wl-input" v-model="wlName" placeholder="品項名稱 *" @keydown.enter="addWl">
            <input class="wl-input" v-model="wlPrice" placeholder="預期價格" @keydown.enter="addWl">
            <input class="wl-input" v-model="wlWhere" placeholder="哪裡買" @keydown.enter="addWl">
            <button class="wl-add-btn" @click="addWl"><i class="fa-solid fa-plus"></i> 新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
