<script setup lang="ts">
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useFileSystemAccess } from "@vueuse/core";

const { file, fileMIME, open } = useFileSystemAccess({});

const url = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));
const ffmpeg = createFFmpeg({
  log: true,
});
const message = ref("Click Start to Transcode");

let video = ref<string>();

async function transcode() {
  if (!file.value) return;
  message.value = "Loading ffmeg-core.js";
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  message.value = "Start transcoding";
  ffmpeg.FS("writeFile", "test.avi", await fetchFile(file.value));
  await ffmpeg.run("-i", "test.avi", "test.mp4");
  message.value = "Complete transcoding";
  const data = ffmpeg.FS("readFile", "test.mp4");
  video.value = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
}

const test = async () => {
  const data = await $fetch("https://assemblyai-web-production.uc.r.appspot.com/transcript", {
    method: "POST",
    headers: {
      authorization: "18513498c8d1cb0-0a3c912adffad3-17525635-4b9600-18513498c8e1538",
    },
  });
  console.log(data);
};
</script>

<template>
  <div>
    <video ref="videoRef" :src="url" controls width="500"></video>
    <button class="btn btn-plain" @click="open()">Select</button>
    <button class="btn btn-primary" @click="transcode">Transcode</button>
    <button class="btn btn-primary" @click="test">test</button>
  </div>
</template>
