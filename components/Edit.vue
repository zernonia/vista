<script setup lang="ts">
import html2canvas from "html2canvas";
import { chunk, toBlob, wait } from "@/utils/functions";
import type { PropType } from "vue";

const props = defineProps({
  video: { type: Object as PropType<Blob | File> },
});
const emits = defineEmits(["save", "active", "completed"]);

const { video } = toRefs(props);

const transcribe = useTranscription();
const { transcode } = useTranscode();
const { computedStyle, computedHighlightStyle } = useConfig();
const { ratio } = usePlayback();

const url = computed(() => (video?.value ? URL.createObjectURL(video.value) : undefined));
const domRef = ref<HTMLDivElement>();

const CHUNK_SIZE = 4;
// todo: need to add frame extension (before & after) on sentence
const groupedTranscribe = computed(() =>
  chunk(transcribe.value, CHUNK_SIZE).map((i) => i.map((j, index) => ({ ...j, end: i[index + 1]?.start ?? j.end })))
);

const step = ref(0);
const blobs = ref<Blob[]>([]);

const magicClick = async () => {
  if (!domRef.value) return;
  for (let i = 0; i < transcribe.value.length; i++) {
    step.value = i;

    await wait(1);
    const c = await html2canvas(domRef.value, { backgroundColor: null });
    const result = await toBlob(c);
    console.log(domRef.value.innerHTML);
    blobs.value.push(result as Blob);
  }
};

const handleTranscode = async () => {
  try {
    emits("save");
    emits("active", true);
    await wait(500);
    await magicClick();
    await transcode(video?.value, blobs.value, groupedTranscribe.value.flat());
    emits("completed");
  } catch (err) {
    console.log(err);
  }
};

const tab = ref<"config" | "transcribe">("config");
</script>

<template>
  <div>
    <div ref="domRef" class="absolute text-shadow-sm -z-1" :style="[computedStyle, { transform: `scale(${ratio})` }]">
      <span
        :style="item.text === transcribe[step].text ? computedHighlightStyle : undefined"
        v-for="item in groupedTranscribe.find((i) => i.find((j) => j.text === transcribe[step].text))"
        >{{ item.text }}&nbsp;</span
      >
    </div>

    <div class="flex flex-col-reverse md:flex-row items-center">
      <div class="flex flex-col mr-6 mt-20 w-full">
        <div class="grid grid-cols-2 rounded-full bg-gray-100 p-1.5 mx-6 overflow-hidden">
          <button
            class="btn"
            :class="[tab == 'config' ? 'bg-white py-4 text-blue-500 shadow-xl shadow-gray-200' : 'text-gray-300']"
            @click="tab = 'config'"
          >
            Style
          </button>
          <button
            class="btn"
            :class="[tab == 'transcribe' ? 'bg-white py-4 text-blue-500 shadow-xl shadow-gray-200' : 'text-gray-300']"
            @click="tab = 'transcribe'"
          >
            Subtitle
          </button>
        </div>
        <div class="mt-6 rounded-3xl mt-4 px-8 py-10 h-min drop-shadow-2xl drop-shadow-color-gray-200 bg-white">
          <div>
            <TranscribeConfig v-if="tab === 'config'"></TranscribeConfig>
            <TranscribeSubtitle v-if="tab === 'transcribe'" :chunks="groupedTranscribe"></TranscribeSubtitle>
          </div>
        </div>

        <div class="mt-20 mx-6">
          <button class="btn btn-plain mr-4" @click="emits('save')">Save</button>
          <button class="btn btn-primary" @click="handleTranscode">Transcode</button>
        </div>
      </div>
      <div>
        <Preview :url="url">
          <PreviewText :chunks="groupedTranscribe"></PreviewText>
        </Preview>
        <PreviewControls></PreviewControls>
      </div>
    </div>
  </div>
</template>
