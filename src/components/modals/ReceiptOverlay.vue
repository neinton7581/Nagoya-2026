<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const storeName = ref('')
const previewUrl = ref('')
const receiptItems = ref([])
const showFooter = ref(false)
const receiptDate = ref('8/22')
const receiptCat = ref('吃吃喝喝')
const receiptPay = ref('現金')

function getLedgerData() {
  try { return JSON.parse(localStorage.getItem('nagoya_ledger') || '[]') } catch { return [] }
}

function openOverlay(file) {
  const apiKey = localStorage.getItem('gemini_api_key')
  if (!apiKey) { alert('請先在 Settings 設定 Gemini API Key'); return }

  isOpen.value = true
  loading.value = true
  errorMsg.value = ''
  showFooter.value = false
  receiptItems.value = []
  storeName.value = ''

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result.split(',')[1]
    const mime = file.type || 'image/jpeg'
    callGeminiOCR(apiKey, base64, mime)
  }
  reader.readAsDataURL(file)
}

function callGeminiOCR(apiKey, base64, mime) {
  const prompt = '這是一張日本商店的收據照片。請仔細辨識以下資訊，並以純JSON格式回傳（絕對不可包含任何markdown、程式碼區塊符號或說明文字，只回傳JSON物件本身）：\n{"store":"店名（若看不到則填unknown）","date":"收據上的日期（格式為M/D，例如3月27日請填3/27；若看不到則填null）","total":收據合計金額數字（不含符號，若看不到則填null）,"items":[{"name":"品項名稱（翻譯成繁體中文，保持簡短）","amount":金額數字}]}\n每個品項的amount必須是數字，不含任何文字或符號。'

  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: prompt },
        { inlineData: { mimeType: mime, data: base64 } }
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
    })
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) throw new Error('API 錯誤：' + (data.error.message || JSON.stringify(data.error)))
      if (!data.candidates?.[0]) throw new Error('API 無回應內容，可能原因：圖片過大、Key 額度不足，或 Key 輸入有誤')
      let text = data.candidates[0].content.parts[0].text
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(text)
      receiptItems.value = (parsed.items || []).map(i => ({ name: i.name, amount: i.amount }))
      storeName.value = (parsed.store && parsed.store !== 'unknown') ? parsed.store : ''
      if (parsed.date && parsed.date !== 'null') receiptDate.value = parsed.date
      loading.value = false
      showFooter.value = true
    })
    .catch(err => {
      loading.value = false
      errorMsg.value = err.message || '未知錯誤'
    })
}

function delReceiptItem(i) { receiptItems.value.splice(i, 1) }
function addReceiptItem() { receiptItems.value.push({ name: '新品項', amount: 0 }) }

function confirmSave() {
  const data = getLedgerData()
  let saved = 0
  receiptItems.value.forEach(item => {
    if (item.name && item.amount !== 0 && !isNaN(item.amount)) {
      data.unshift({
        name: item.name, store: storeName.value,
        jpy: Math.round(item.amount), amt: Math.round(item.amount), currency: 'JPY',
        date: receiptDate.value, cat: receiptCat.value, pay: receiptPay.value,
        thumb: null, id: Date.now() + Math.random()
      })
      saved++
    }
  })
  localStorage.setItem('nagoya_ledger', JSON.stringify(data))
  if (typeof window.saveLedgerData === 'function') window.saveLedgerData(data)
  if (typeof window.nagoyaRenderLedger === 'function') window.nagoyaRenderLedger()
  closeOverlay()
  alert(`已新增 ${saved} 筆記帳！`)
}

function closeOverlay() {
  isOpen.value = false
  loading.value = false
  errorMsg.value = ''
  receiptItems.value = []
  storeName.value = ''
  showFooter.value = false
  if (previewUrl.value) { URL.revokeObjectURL(previewUrl.value); previewUrl.value = '' }
}

onMounted(() => { window.openReceiptOverlay = openOverlay })
</script>

<template>
  <div v-if="isOpen" class="receipt-overlay open">
    <!-- Header -->
    <div class="receipt-hd">
      <button class="receipt-back-btn" @click="closeOverlay">
        <i class="fa-solid fa-chevron-left"></i> 返回
      </button>
      <div class="receipt-hd-title">確認收據內容</div>
      <div class="receipt-hd-sub">請確認或修改以下辨識結果</div>
    </div>

    <!-- Body -->
    <div class="receipt-body">
      <!-- Loading -->
      <div v-if="loading" class="receipt-loading">
        <div class="receipt-spinner"></div>
        <div class="receipt-loading-txt">AI 正在辨識收據…</div>
        <div class="receipt-loading-sub">請稍候，這可能需要幾秒鐘</div>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="receipt-loading">
        <div style="font-size:2rem;">⚠️</div>
        <div class="receipt-loading-txt">辨識失敗</div>
        <div class="receipt-loading-sub" style="max-width:280px;text-align:center;word-break:break-all;">{{ errorMsg }}</div>
        <button @click="closeOverlay" style="margin-top:1rem;padding:0.6rem 1.5rem;background:#4a7a9b;color:#fff;border:none;border-radius:8px;cursor:pointer;">關閉</button>
      </div>

      <!-- Confirmed items -->
      <template v-else-if="showFooter">
        <div class="receipt-store-card">
          <img v-if="previewUrl" :src="previewUrl" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:0.8rem;">
          <div>
            <div class="receipt-store-name">{{ storeName || '收據' }}</div>
            <div class="receipt-store-date">請選擇下方日期・類別・付款方式</div>
          </div>
        </div>

        <div class="receipt-items-wrap">
          <div class="receipt-items-hd">
            <span class="receipt-items-label">購買明細</span>
            <button class="receipt-add-btn" @click="addReceiptItem">＋ 新增品項</button>
          </div>
          <div v-if="receiptItems.length === 0" style="padding:1rem;text-align:center;color:rgba(101,152,181,0.4);font-size:0.8rem;">無品項</div>
          <div v-for="(item, i) in receiptItems" :key="i" class="receipt-row">
            <div class="receipt-row-num">{{ i + 1 }}</div>
            <input class="receipt-row-name" v-model="item.name">
            <span style="color:rgba(101,152,181,0.5);font-size:0.8rem;">¥</span>
            <input class="receipt-row-amt" v-model.number="item.amount" type="number">
            <button class="receipt-row-del" @click="delReceiptItem(i)"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <div v-if="showFooter" class="receipt-footer">
      <div class="receipt-options-row">
        <select class="wallet-select" v-model="receiptDate" style="flex:1;">
          <option value="8/22">8/22 六</option>
          <option value="8/23">8/23 日</option>
          <option value="8/24">8/24 一</option>
          <option value="8/25">8/25 二</option>
          <option value="8/26">8/26 三</option>
        </select>
        <select class="wallet-select" v-model="receiptCat" style="flex:1;">
          <option>吃吃喝喝</option>
          <option>交通</option>
          <option>伴手禮</option>
          <option>送自己的</option>
          <option>住宿</option>
        </select>
        <select class="wallet-select" v-model="receiptPay" style="flex:1;">
          <option value="現金">💴 現金</option>
          <option value="信用卡">💳 信用卡</option>
          <option value="Suica">🍉 Suica</option>
          <option value="PayPay">📱 PayPay</option>
          <option value="其他">💫 其他</option>
        </select>
      </div>
      <button class="receipt-save-btn" @click="confirmSave">
        確認儲存（{{ receiptItems.length }} 筆）
      </button>
      <div class="receipt-save-note">儲存後將自動同步至雙機</div>
    </div>
  </div>
</template>
