<script setup lang="ts">
import { wait } from "@/utils/functions";

const { file, fileName, open } = useFileSystemAccess({
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

const user = useSupabaseUser();
const client = useSupabase();

const { el, duration, playing } = usePlayback();
const inMemoryFile = useInMemoryFile();

const title = ref("");
const isOffLimit = computed(() => duration.value >= 15);

const url = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));

const progress = ref(0);
const isProcessing = computed(() => progress.value !== 0);
// if non login, only max 20seconds
const uploadToStorage = async () => {
  if (!file.value || !title.value) return;
  try {
    progress.value = 0.2;
    const { data: assetData } = await client.storage
      .from("assets")
      .upload(`${user.value?.id}/${fileName.value}`, file.value, { upsert: true });
    const { data: transcriptionData } = await client.functions.invoke("transcribe", {
      body: {
        video_key: assetData?.path,
      },
    });
    progress.value = 0.6;
    const { data: projectData } = await client
      .from("projects")
      .insert({
        user_id: user.value?.id,
        video_key: assetData?.path,
        transcription_id: transcriptionData.id,
      })
      .select("id")
      .single();

    progress.value = 1;
    if (projectData?.id && url.value) {
      // save in-memory file into states
      await wait(300);
      inMemoryFile.value[projectData.id] = file.value;
      navigateTo(`/v/${projectData.id}`);
    }
  } catch (err) {
    progress.value = 0;
    console.log(err);
  }
};
</script>

<template>
  <div>
    <div class="flex justify-center">
      <button :class="[url ? 'btn-plain ' : 'btn-primary my-20']" @click="open()">select or drop file</button>
    </div>

    <div v-if="file" class="flex flex-col items-center mt-4">
      <div class="max-w-screen-md m-auto">
        <button @click="playing = !playing" class="border relative rounded-3xl overflow-hidden">
          <video ref="el" class="max-h-screen-sm" :src="url"></video>

          <div
            class="overlay absolute right-0 top-0 h-full bg-opacity-40 transition-all duration-300 ease-in-out border-l-2 border-white border-opacity-50"
            :class="[isProcessing ? 'bg-dark-100' : 'bg-transparent']"
            :style="{ width: isProcessing ? (1 - progress) * 100 + '%' : '100%' }"
          ></div>
        </button>
        <PreviewControls></PreviewControls>
      </div>

      <div v-if="isOffLimit" class="text-red font-semibold my-4">Video is too long, currently only max 15 seconds.</div>

      <div class="mt-12 flex items-center">
        <input type="text" class="mr-4 w-full !rounded-full !px-4 !py-3" v-model="title" placeholder="Project title" />
        <button :disabled="isOffLimit || !title" @click="uploadToStorage" class="btn-primary">Upload</button>
      </div>
    </div>
  </div>
</template>
