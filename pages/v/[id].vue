<script setup lang="ts">
import { file } from "@babel/types";

const client = useSupabase();
const inMemoryFile = useInMemoryFile();

const channel = client
  .channel("public:projects")
  .on("postgres_changes", { event: "UPDATE", schema: "public", table: "projects" }, (payload) => {
    // @ts-ignore
    data.value = payload.new;
    transcribe.value = payload.new.transcription.words;
    console.log(payload);
  })
  .subscribe();

const video = ref<Blob | File>();
const transcribe = ref([]);

const id = useRoute().params.id.toString();
const { data } = useAsyncData(async () => {
  const { data } = await client.from("projects").select("*").eq("id", id).single();

  // if transcription ready, remove websocket
  if (data?.transcription) {
    // @ts-expect-error
    transcribe.value = data.transcription.words;
    client.removeChannel(channel);
  }
  return data;
});

onUnmounted(() => {
  client.removeChannel(channel);
});

onMounted(() => {
  const file = inMemoryFile.value[id];
  if (file) video.value = file;
});

whenever(data, async () => {
  if (!data.value?.video_key || inMemoryFile.value[id]) return;
  const result = await client.storage.from("assets").download(data.value.video_key);
  if (result.data) video.value = result.data;
});
</script>

<template>
  <div>
    <Edit :video="video" :transcribe="transcribe"></Edit>
  </div>
</template>
