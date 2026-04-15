<script setup>
defineProps({ src: String })
defineEmits(['close'])
</script>

<template>
  <div v-if="src" class="photo-lightbox open" @click="$emit('close')">
    <button class="photo-lightbox-close" @click.stop="$emit('close')">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <img :src="src" alt="">
  </div>
</template>
