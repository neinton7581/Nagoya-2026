<script setup>
defineProps({ day: Object })
defineEmits(['select'])
</script>

<template>
  <div class="day-img-card" @click="$emit('select', day)">
    <div class="day-img-bg" :style="day.image ? { backgroundImage: `url(${day.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: day.gradient }"></div>
    <div class="day-img-date-badge">{{ day.date }}</div>
    <div class="day-img-overlay">
      <div class="day-img-num">{{ day.num }}</div>
      <div class="day-img-title">{{ day.title }}</div>
    </div>
    <div class="day-img-arrow"><i class="fa-solid fa-chevron-right"></i></div>
  </div>
</template>

<style scoped>
.day-img-card {
  position: relative;
  height: 130px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 2px 14px rgba(0,0,0,.22);
  -webkit-tap-highlight-color: transparent;
}
.day-img-card:active {
  opacity: .85;
}
.day-img-bg {
  position: absolute;
  inset: 0;
}
.day-img-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,.42);
  color: #fff;
  font-size: .72rem;
  padding: 3px 11px;
  border-radius: 20px;
  letter-spacing: .03em;
}
.day-img-overlay {
  position: absolute;
  bottom: 14px;
  left: 16px;
  text-shadow: 0 1px 6px rgba(0,0,0,.5);
}
.day-img-num {
  font-size: .72rem;
  color: rgba(255,255,255,.8);
  letter-spacing: .08em;
  text-transform: uppercase;
}
.day-img-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin-top: 2px;
}
.day-img-arrow {
  position: absolute;
  right: 14px;
  bottom: 14px;
  color: rgba(255,255,255,.75);
  font-size: .9rem;
}
</style>
