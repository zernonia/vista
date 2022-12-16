<script setup lang="ts">
const { duration, currentTime, playing } = usePlayback();

onKeyStroke(
  " ",
  (e) => {
    if (!activeElement.value?.dataset.id) {
      playing.value = !playing.value;
    }
  },
  { eventName: "keyup" }
);
const activeElement = useActiveElement();
</script>

<template>
  <div class="w-full flex items-center mt-8">
    <button @click="playing = !playing" class="rounded-full bg-blue-100 text-blue p-1 flex items-center justify-center">
      <div class="i-bx-play text-4xl"></div>
    </button>
    <input type="range" class="ml-6 w-full" v-model="currentTime" min="0" step="0.01" :max="duration" />
  </div>
</template>
