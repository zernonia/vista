<script setup lang="ts">
defineProps({
  url: String,
});

const { el, videoWidth, videoHeight, playing } = usePlayback();

const loadedVideo = () => {
  videoWidth.value = el.value?.videoWidth ?? 0;
  videoHeight.value = el.value?.videoHeight ?? 0;
};
</script>

<template>
  <div class="relative w-120 min-h-64 h-min flex-shrink-0 overflow-hidden">
    <button class="w-full" @click="playing = !playing">
      <video ref="el" :src="url" class="w-full rounded-3xl border" v-show="url" @loadedmetadata="loadedVideo"></video>

      <div v-if="!url" class="my-20 flex w-full items-center justify-center">
        <Loading class="w-12 h-12 text-blue-500 animate-spin"></Loading>
      </div>
    </button>

    <slot></slot>
  </div>
</template>
