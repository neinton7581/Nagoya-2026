<script setup>
defineProps({ open: Boolean })
const emit = defineEmits(['close'])
function handleBg(e) { if (e.target.classList.contains('tool-modal')) emit('close') }
</script>

<template>
  <div class="tool-modal" :class="{ open }" @click="handleBg">
    <div class="tool-modal-card">
      <div class="tool-modal-header">
        <span class="tool-modal-title"><i class="fa-solid fa-circle-info"></i>Info</span>
        <button class="tool-modal-close" @click="$emit('close')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="tool-modal-body">

        <!-- 天氣 -->
        <div class="info-card">
          <div class="info-card-title"><i class="fa-solid fa-cloud-sun"></i>天氣預報</div>
          <div class="info-body">
            <a class="info-link-btn" href="https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=230000" target="_blank">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>日本氣象廳 愛知縣
            </a>
            <a class="info-link-btn" href="https://www.windy.com/?35.181,136.907,7" target="_blank">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>Windy 名古屋
            </a>
            <a class="info-link-btn" href="https://weather.com/zh-TW/weather/tenday/l/Nagoya+Aichi+Japan+JAXX0116:1:JA" target="_blank">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>Weather.com 10天預報
            </a>
          </div>
        </div>

        <!-- 緊急聯絡 -->
        <div class="info-card">
          <div class="info-card-title"><i class="fa-solid fa-phone-volume"></i>緊急聯絡</div>
          <div class="info-body">
            <div class="emergency-row"><span class="emergency-label">🚔 警察</span><a class="emergency-num" href="tel:110">110</a></div>
            <div class="emergency-row"><span class="emergency-label">🚒 消防・救護車</span><a class="emergency-num" href="tel:119">119</a></div>
            <div class="emergency-row"><span class="emergency-label">🏥 外國人諮詢（愛知）</span><a class="emergency-num" href="tel:+81522623789" style="font-size:0.88rem;">052-262-3789</a></div>
            <div class="emergency-row"><span class="emergency-label">🏛️ 台北駐大阪經濟文化辦事處</span><a class="emergency-num" href="tel:+81662439420" style="font-size:0.88rem;">06-6243-9420</a></div>
          </div>
        </div>

        <!-- 旅遊注意 -->
        <div class="info-card">
          <div class="info-card-title"><i class="fa-solid fa-triangle-exclamation"></i>入出境 &amp; 旅遊注意</div>
          <div class="info-body">
            <div class="taboo-row"><span class="taboo-icon">🚫</span><span><strong>現金攜帶限額</strong>｜超過 ¥1,000,000 須向海關申報</span></div>
            <div class="taboo-row"><span class="taboo-icon">🚫</span><span><strong>藥品管制</strong>｜部分感冒藥含偽麻黃素，在日本屬違禁，請事先確認</span></div>
            <div class="taboo-row"><span class="taboo-icon">📋</span><span><strong>Visit Japan Web</strong>｜入境前完成 VJW 登錄可快速通關</span></div>
            <div class="taboo-row"><span class="taboo-icon">💡</span><span><strong>小費文化</strong>｜日本無小費習慣</span></div>
            <div class="taboo-row"><span class="taboo-icon">💡</span><span><strong>電車禮儀</strong>｜車廂內禁止通話，請調靜音</span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
