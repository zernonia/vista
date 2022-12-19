<script setup lang="ts">
const client = useSupabase();
const inMemoryFile = useInMemoryFile();
const transcribe = useTranscription();
const { config, resetConfig } = useConfig();
const { message, progress, video: renderedResult } = useTranscode();

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
const { data, pending } = useAsyncData(id, async () => {
  const { data } = await client.from("projects").select("*").eq("id", id).single();

  // if transcription ready, remove websocket
  if (data?.words) {
    // @ts-ignore
    transcribe.value = data.words;
    client.removeChannel(channel);
  }
  return data;
});

const handleSave = async () => {
  await client
    .from("projects")
    .update({
      // @ts-ignore
      words: transcribe.value.length ? transcribe.value : undefined,
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

watch(
  data,
  () => {
    resetConfig();
    // @ts-ignore
    if (data.value?.config) config.value = data.value.config;
  },
  { immediate: true }
);

const isActive = ref(false);
const isCompleted = ref(false);
const isSomethingWrong = ref(false);

const handleCompleted = () => {
  isCompleted.value = true;
  isActive.value = false;
};

const handleError = async () => {
  isSomethingWrong.value = true;
};

onMounted(() => {
  window.onbeforeunload = function () {
    if (isActive.value) return "You haven't saved your changes.";
  };
});

definePageMeta({
  middleware: "auth",
});

useCustomHead(computed(() => `Edit: ${data.value?.title ?? ""}`));
</script>

<template>
  <div>
    <div v-if="pending && !data" class="my-20 flex items-center justify-center">
      <Loading></Loading>
    </div>
    <div v-else-if="!isCompleted">
      <h1 class="mt-4 mb-8">{{ data?.title }}</h1>
      <Edit
        :video="video"
        @active="isActive = $event"
        @completed="handleCompleted"
        @save="handleSave"
        @error="handleError"
      ></Edit>
    </div>
    <Completed @edit="isCompleted = false" v-else :url="renderedResult"></Completed>

    <Overlay :active="isActive">
      <div class="flex" v-if="isSomethingWrong">
        <div>
          <p>Sorry, something is wrong</p>
          <p>Please try create and transcode with this video (for demo purposes).</p>

          <a
            href="https://raw.githubusercontent.com/zernonia/vista/main/assets/original.mp4"
            target="_blank"
            class="mt-4 underline text-blue-500"
            >Demo video</a
          >
        </div>
      </div>
      <div v-else class="flex flex-col">
        <div class="flex rounded-full p-4 bg-white w-80 shadow-xl">
          <Loading></Loading>
          <div class="flex flex-col ml-6 text-blue-500">
            <p class="mt-1">{{ message }}</p>
            <p class="text-sm font-semibold">{{ (progress * 100).toFixed(0) }}%</p>
          </div>
        </div>

        <div class="mt-6 px-4">
          <p class="text-sm text-dark-50">While waiting, perhaps...</p>

          <div class="ml-2">
            <NuxtLink
              class="mt-4 text-gray-300 hover:text-gray-800 transition flex items-center"
              target="_blank"
              to="https://github.com/zernonia/vista"
              ><div class="i-bx-bxl-github text-3xl mr-2"></div>
              Star repo
            </NuxtLink>
            <NuxtLink
              class="mt-1 text-gray-300 hover:text-gray-800 transition flex items-center"
              target="_blank"
              to="https://twitter.com/intent/tweet?original_referer=https://www.vistaeditor.com/&text=Check%20out%20Vista%20Editor%20by%20@zernonia&url=https://www.vistaeditor.com/"
              ><div class="i-bx-bxl-twitter text-3xl mr-2"></div>
              Share on Twitter
            </NuxtLink>
          </div>
        </div>
      </div>
    </Overlay>
  </div>
</template>
