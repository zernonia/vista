<script setup lang="ts">
import type { PropType } from "vue";
import type { Transcribe } from "@/utils/interface";

const props = defineProps({
  chunks: { type: Array as PropType<Transcribe[][]>, required: true },
});
const { chunks } = toRefs(props);
const transcribe = useTranscription();

const { currentTime } = usePlayback();

const updateText = (ev: Event, item: Transcribe) => {
  const value = (ev.target as HTMLDivElement)?.innerText;
  const originalIndex = transcribe.value.findIndex((i) => i.start === item.start);
  transcribe.value[originalIndex].text = value;
};

const currentChunk = computed(() =>
  chunks.value.find((i) => currentTime.value >= i[0].start / 1000 && currentTime.value <= i[i.length - 1]?.end / 1000)
);
</script>

<template>
  <div>
    <ul v-if="chunks.length" class="w-full flex flex-col">
      <button
        v-for="transcribes in chunks"
        class="p-2 mb-2 transition rounded-xl hover:bg-gray-50"
        :class="{ 'bg-gray-50  ': currentChunk?.[0].start === transcribes[0].start }"
        @click="currentTime = transcribes[0].start / 1000"
      >
        <div
          class="flex text-sm mb-2 rounded-full px-3 py-1.5 transition w-max"
          :class="[
            currentChunk?.[0].start === transcribes[0].start ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500',
          ]"
        >
          <span>{{ (transcribes[0].start / 1000).toFixed(2) }}</span>
          <span class="mx-2">-</span>
          <span>{{ (transcribes[transcribes.length - 1].end / 1000).toFixed(2) }}</span>
        </div>
        <div class="flex ml-2 text-dark-200">
          <div
            role="textbox"
            class="mr-1"
            contenteditable
            v-for="item in transcribes"
            @input="updateText($event, item)"
          >
            {{ item.text }}
          </div>
        </div>
      </button>
    </ul>

    <div v-else class="flex justify-center my-20 text-blue-500 animate-spin">
      <Loading class="w-12 h-12"></Loading>
    </div>
  </div>
</template>

<style scoped lang="postcss">
div[contenteditable] {
  @apply focus:px-2 focus:outline-blue-400;
}
</style>
