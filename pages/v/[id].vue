<script setup lang="ts">
const client = useSupabase();
const inMemoryFile = useInMemoryFile();
const transcribe = useTranscription();
const { config } = useConfig();

const channel = client
  .channel("public:projects")
  .on("postgres_changes", { event: "UPDATE", schema: "public", table: "projects" }, (payload) => {
    // @ts-ignore
    data.value = payload.new;
    transcribe.value = payload.new.words;
    console.log(payload);
  })
  .subscribe();

const video = ref<Blob | File>();

const id = useRoute().params.id.toString();
const { data } = useAsyncData(async () => {
  const { data } = await client.from("projects").select("*").eq("id", id).single();

  // if transcription ready, remove websocket
  if (data?.words) {
    // @ts-ignore
    transcribe.value = data.words;
    // @ts-ignore
    if (data.config) config.value = data.config;
    client.removeChannel(channel);
  }
  return data;
});

const handleSave = async () => {
  await client
    .from("projects")
    .update({
      // @ts-ignore
      words: transcribe.value,
      config: config.value,
    })
    .eq("id", id);
};

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
    <Edit :video="video" @save="handleSave"></Edit>
  </div>
</template>
