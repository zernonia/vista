<script setup lang="ts">
import Konva from "konva";
import { useFileSystemAccess } from "@vueuse/core";
import { useMediaControls } from "@vueuse/core";

import html2canvas from "html2canvas";

const { file, fileMIME, open } = useFileSystemAccess({
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

const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();

const previousTime = ref(0);
const { playing, currentTime, ended } = useMediaControls(videoRef, {
  src: "video.mp4",
});

let stage: Konva.Stage;
let layer: Konva.Layer;

let image: Konva.Image;
let shape: Konva.Image;

const togglePause = (val: boolean) => {
  if (val) {
    recorder.pause();
    playing.value = false;
  } else {
    recorder.resume();
    playing.value = true;
  }
};

const play = async () => {
  await renderDOM();
  recorder.start(100);

  const step = async () => {
    if (ended.value) {
      return;
    }
    layer.draw();
    togglePause(true);
    await renderDOM();
    togglePause(false);
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const loadedVideo = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const width = videoRef.value.videoWidth;
  const height = videoRef.value.videoHeight;
  const ratio = width / height;

  const canvasWidth = canvasRef.value.getBoundingClientRect().width;
  const canvasHeight = canvasWidth / ratio;

  stage = new Konva.Stage({
    container: "canvas",
    width: canvasWidth,
    height: canvasHeight,
  });

  layer = new Konva.Layer();
  stage.add(layer);

  // image = new Konva.Image({
  //   image: videoRef.value,
  //   x: 0,
  //   y: 0,
  // });

  // layer.add(image);

  // image.width(canvasWidth);
  // image.height(canvasHeight);

  // @ts-expect-error
  shape = new Konva.Image({
    x: 30,
    y: canvasHeight - 100,
    draggable: true,
  });
  layer.add(shape);
};

const domRef = ref<HTMLDivElement>();
const renderDOM = async () => {
  try {
    if (!domRef.value) return;
    if (currentTime.value - previousTime.value > 0.5) {
      const c = await html2canvas(domRef.value, { backgroundColor: null });
      shape.image(c);
      previousTime.value = currentTime.value;
      console.log(currentTime.value, previousTime.value);
    }
  } catch (err) {
    throw err;
  }
};

const overlay = ref<Blob>();
const recording_url = ref("");
const chunks: any[] = [];
let recorder: MediaRecorder;
const stream = () => {
  play();

  const c = layer.getCanvas()._canvas;
  const s = c.captureStream(30);
  recorder = new MediaRecorder(s, { mimeType: "video/webm;codecs=vp9" });

  recorder.ondataavailable = (ev) => chunks.push(ev.data);

  recorder.onstop = () => {
    var blob = new Blob(chunks, { type: "video/webm" });
    overlay.value = blob;
    recording_url.value = URL.createObjectURL(overlay.value);
  };
};

watch(ended, (n) => {
  if (n) recorder.stop();
});

const transcribe = [
  {
    text: "This",
    start: 570,
    end: 734,
    confidence: 0.9933,
  },
  {
    text: "is",
    start: 772,
    end: 974,
    confidence: 0.98673,
  },
  {
    text: "being",
    start: 1012,
    end: 1214,
    confidence: 0.98756,
  },
  {
    text: "captured",
    start: 1252,
    end: 1642,
    confidence: 0.76225,
  },
  {
    text: "in",
    start: 1706,
    end: 1982,
    confidence: 0.99757,
  },
  {
    text: "30",
    start: 2036,
    end: 2734,
    confidence: 1,
  },
  {
    text: "frames",
    start: 2932,
    end: 3514,
    confidence: 0.47643,
  },
  {
    text: "per",
    start: 3562,
    end: 3774,
    confidence: 0.99,
  },
  {
    text: "second.",
    start: 3812,
    end: 3900,
    confidence: 1,
  },
];

const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (value, index) =>
    array.slice(index * size, index * size + size)
  );

const groupedTranscribe = computed(() =>
  chunk(transcribe, 3).map((i) => i.map((j, index) => ({ ...j, end: i[index + 1]?.start ?? j.end })))
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

  console.log(blobs.value);
};

const contructUrl = (blob: Blob) => URL.createObjectURL(blob);
</script>

<template>
  <div>
    <div
      ref="domRef"
      class="p-4 rounded-xl m-0 box-content overflow-none bg-blue text-white text-8xl w-max absolute -z-1"
    >
      <span
        :class="{ 'font-bold': item.text === transcribe[step].text }"
        v-for="item in groupedTranscribe.find((i) => i.find((j) => j.text === transcribe[step].text))"
        >{{ item.text }}&nbsp;</span
      >
    </div>

    <video muted ref="videoRef" :src="url" width="500" @loadedmetadata="loadedVideo"></video>
    <div ref="canvasRef" id="canvas" class="border max-w-screen-md mx-auto"></div>
    <button class="btn btn-plain" @click="open()">Select</button>
    <button class="btn btn-primary" :disabled="!file" @click="transcode(file, blobs, groupedTranscribe.flat())">
      Transcode
    </button>
    <button class="btn btn-primary" :disabled="!file" @click="play">Play</button>

    <button class="btn btn-primary" :disabled="!file" @click="stream">Stream</button>

    <button class="btn btn-primary" @click="magicClick">Magic</button>

    <div>
      <h1>Transcode</h1>
      <video v-if="recording_url" autoplay :src="recording_url" loop width="500"></video>
      <video v-if="result" autoplay :src="result" loop width="500"></video>
    </div>

    <div>
      <img :src="contructUrl(image)" v-for="image in blobs" alt="" />
    </div>
  </div>
</template>
