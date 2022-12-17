<script setup lang="ts">
defineProps({
  url: String,
});

const { el, videoWidth, videoHeight, playing } = usePlayback();

const loadedVideo = () => {
  videoWidth.value = el.value?.videoWidth ?? 0;
  videoHeight.value = el.value?.videoHeight ?? 0;
  // once loaded we save to Supabase and transcribe
};
</script>

<template>
  <div class="relative w-120 min-h-64 h-min flex-shrink-0 overflow-hidden">
    <button @click="playing = !playing">
      <video ref="el" :src="url" class="w-full rounded-3xl border" v-show="url" @loadedmetadata="loadedVideo"></video>
    </button>

    <slot></slot>
  </div>
</template>
