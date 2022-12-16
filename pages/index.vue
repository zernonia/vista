<script setup lang="ts">
import { useFileSystemAccess } from "@vueuse/core";
import html2canvas from "html2canvas";

const { file, open } = useFileSystemAccess({
  dataType: "Blob",
  types: [
    {
      description: "Videos",
      accept: {
        "video/*": [".mp4", ".avi", ".mov", ".wmv"],
      },
    },
  ],
  excludeAcceptAllOption: true,
});

const url = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));
const { transcode, video: result } = useTranscode();
const { computedStyle, computedHighlightStyle } = useConfig();
const { ratio } = usePlayback();

const domRef = ref<HTMLDivElement>();

const transcribe = [
  { text: "This", start: 570, end: 734, confidence: 0.9933 },
  { text: "is", start: 772, end: 974, confidence: 0.98673 },
  { text: "being", start: 1012, end: 1214, confidence: 0.98756 },
  { text: "captured", start: 1252, end: 1642, confidence: 0.76225 },
  { text: "in", start: 1706, end: 1982, confidence: 0.99757 },
  { text: "30", start: 2036, end: 2734, confidence: 1 },
  { text: "frames", start: 2932, end: 3514, confidence: 0.47643 },
  { text: "per", start: 3562, end: 3774, confidence: 0.99 },
  { text: "second.", start: 3812, end: 3900, confidence: 1 },
];

const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (value, index) =>
    array.slice(index * size, index * size + size)
  );

const CHUNK_SIZE = 4;
// todo: need to add frame extension (before & after) on sentence
const groupedTranscribe = computed(() =>
  chunk(transcribe, CHUNK_SIZE).map((i) => i.map((j, index) => ({ ...j, end: i[index + 1]?.start ?? j.end })))
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
  for (let i = 0; i < transcribe.length; i++) {
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
  transcode(file.value, blobs.value, groupedTranscribe.value.flat());
};
</script>

<template>
  <div class="p-12 max-w-screen-lg mx-auto">
    <div ref="domRef" class="absolute -z-1" :style="[computedStyle, { transform: `scale(${ratio})` }]">
      <span
        :style="item.text === transcribe[step].text ? computedHighlightStyle : undefined"
        v-for="item in groupedTranscribe.find((i) => i.find((j) => j.text === transcribe[step].text))"
        >{{ item.text }}&nbsp;</span
      >
    </div>

    {{ ratio }}
    <div class="flex">
      <div class="w-full mr-6">
        <TranscribePanel :chunk="groupedTranscribe"></TranscribePanel>
        <TranscribeConfig></TranscribeConfig>
      </div>
      <div>
        <Preview :url="url">
          <PreviewText :chunks="groupedTranscribe"></PreviewText>
        </Preview>
        <PreviewControls></PreviewControls>
      </div>
    </div>

    <button class="btn btn-plain" @click="open()">Select</button>
    <button class="btn btn-primary" :disabled="!file" @click="handleTranscode">Transcode</button>

    <div>
      <h1>Transcode</h1>
      <video v-if="result" controls :src="result" loop width="500"></video>
    </div>

    <!-- <div>
      <img :src="contructUrl(image)" v-for="image in blobs" alt="" />
    </div> -->
  </div>
</template>
