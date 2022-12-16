<script setup lang="ts">
defineProps({
  url: String,
});

const { el, ratio } = usePlayback();

const loadedVideo = () => {
  ratio.value = (el.value?.videoWidth ?? 0) / 480;
  // once loaded we save to Supabase and transcribe
};
</script>

<template>
  <div class="relative w-120 min-h-64 h-min border flex-shrink-0 overflow-hidden">
    <video ref="el" :src="url" class="w-full" v-show="url" @loadedmetadata="loadedVideo"></video>

    <slot></slot>
  </div>
</template>
