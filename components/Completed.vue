<script setup lang="ts">
defineProps({
  url: String,
});
</script>

<template>
  <div>
    <Preview :url="url" />
    <PreviewControls />
  </div>
</template>
