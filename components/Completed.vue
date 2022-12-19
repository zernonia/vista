<script setup lang="ts">
import { downloadBlob } from "@/utils/functions";

defineProps({
  url: { type: String, default: "" },
});

const emits = defineEmits(["edit"]);
</script>

<template>
  <div class="w-max mx-auto my-20">
    <h1 class="mb-16">Completed! 🎉</h1>

    <Preview :url="url" />
    <PreviewControls />

    <div class="grid grid-cols-3 gap-4 mt-12">
      <button class="btn-primary" @click="downloadBlob(url)">
        Download
        <div class="ml-2 text-xl i-bx-download"></div>
      </button>
      <button class="btn-plain" @click="emits('edit')">
        Edit
        <div class="ml-2 text-xl i-bx-edit"></div>
      </button>
      <NuxtLink
        target="_blank"
        to="https://twitter.com/intent/tweet?original_referer=https://www.vistaeditor.com/&text=Check%20out%20Vista%20Editor%20by%20@zernonia&url=https://www.vistaeditor.com/"
        class="btn-plain"
      >
        Share
        <div class="ml-2 text-xl i-bx-share-alt"></div>
      </NuxtLink>
    </div>
  </div>
</template>
