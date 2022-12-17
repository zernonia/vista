<script setup lang="ts">
import type { PropType } from "vue";
import type { Transcribe } from "@/utils/interface";

const props = defineProps({
  chunks: { type: Array as PropType<Transcribe[][]>, required: true },
});

const { currentTime } = usePlayback();
</script>

<template>
  <div class="w-full">
    <ul v-for="transcribes in chunks">
      <li class="p-2 border mb-2" @click="currentTime = transcribes[0].start / 1000">
        <div class="flex justify-between text-sm mb-2">
          <span>{{ transcribes[0].start / 1000 }}</span>
          <span>{{ transcribes[transcribes.length - 1].end / 1000 }}</span>
        </div>
        <span v-for="transcribe in transcribes">{{ transcribe.text }}&nbsp;</span>
      </li>
    </ul>
  </div>
</template>
