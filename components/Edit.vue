<script setup lang="ts">
import html2canvas from "html2canvas";
import type { PropType } from "vue";
import type { Transcribe } from "@/utils/interface";

const props = defineProps({
  video: { type: Object as PropType<Blob | File> },
  transcribe: { type: Object as PropType<Transcribe[]>, default: [] },
});

const { video, transcribe } = toRefs(props);

const { transcode, video: result } = useTranscode();
const { computedStyle, computedHighlightStyle } = useConfig();
const { ratio } = usePlayback();

const url = computed(() => (video?.value ? URL.createObjectURL(video.value) : undefined));
const domRef = ref<HTMLDivElement>();

const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (value, index) =>
    array.slice(index * size, index * size + size)
  );

const CHUNK_SIZE = 4;
// todo: need to add frame extension (before & after) on sentence
const groupedTranscribe = computed(() =>
  chunk(transcribe.value, CHUNK_SIZE).map((i) => i.map((j, index) => ({ ...j, end: i[index + 1]?.start ?? j.end })))
);

const step = ref(0);
const blobs = ref<Blob[]>([]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const toBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      resolve(result as Blob);
    });
  });

const magicClick = async () => {
  if (!domRef.value) return;
  for (let i = 0; i < transcribe.value.length; i++) {
    step.value = i;

    await sleep(1);
    const c = await html2canvas(domRef.value, { backgroundColor: null });
    const result = await toBlob(c);
    console.log(domRef.value.innerHTML);
    blobs.value.push(result as Blob);
  }
};

const handleTranscode = async () => {
  await magicClick();
  transcode(video?.value, blobs.value, groupedTranscribe.value.flat());
};

const tab = ref<"config" | "transcribe">("config");
</script>

<template>
  <div>
    <div ref="domRef" class="absolute -z-1" :style="[computedStyle, { transform: `scale(${ratio})` }]">
      <span
        :style="item.text === transcribe[step].text ? computedHighlightStyle : undefined"
        v-for="item in groupedTranscribe.find((i) => i.find((j) => j.text === transcribe[step].text))"
        >{{ item.text }}&nbsp;</span
      >
    </div>

    <div class="flex flex-col-reverse md:flex-row">
      <div class="mr-6 flex-1">
        <div>
          <button class="btn-primary" @click="tab = 'config'">Style</button>
          <button class="btn-primary" @click="tab = 'transcribe'">Subtitle</button>
        </div>
        <div class="mt-2">
          <TranscribeConfig v-if="tab === 'config'"></TranscribeConfig>
          <TranscribePanel v-if="tab === 'transcribe'" :chunk="groupedTranscribe"></TranscribePanel>
        </div>
      </div>
      <div>
        <Preview :url="url">
          <PreviewText :chunks="groupedTranscribe"></PreviewText>
        </Preview>
        <PreviewControls></PreviewControls>
      </div>
    </div>

    <button class="btn btn-primary" @click="handleTranscode">Transcode</button>

    <div>
      <h1>Transcode</h1>
      <video v-if="result" controls :src="result" loop width="500"></video>
    </div>

    <User></User>
  </div>
</template>
