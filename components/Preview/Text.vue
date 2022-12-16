<script setup lang="ts">
import type { PropType } from "vue";
import type { Transcribe } from "@/utils/interface";

const props = defineProps({
  chunks: Array as PropType<Transcribe[][]>,
});

const { currentTime } = usePlayback();
const { chunks } = toRefs(props);
const { computedStyle, computedHighlightStyle } = useConfig();

const timestamp = computed(() => currentTime.value * 1000);

const currentChunk = computed(() =>
  chunks?.value?.find((i) => timestamp.value >= i?.[0]?.start && timestamp.value <= i?.[i.length - 1]?.end)
);

const activeTranscribe = computed(() =>
  currentChunk.value?.find((i) => timestamp.value >= i.start && timestamp.value <= i.end)
);

const el = ref();
defineExpose({ el });
</script>

<template>
  <div class="absolute" ref="el" :style="computedStyle" v-if="activeTranscribe">
    <span
      :style="activeTranscribe?.text === transribe.text ? computedHighlightStyle : undefined"
      v-for="transribe in currentChunk"
      >{{ transribe.text }}&nbsp;</span
    >
  </div>
</template>
