<script setup lang="ts">
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

const el = ref<HTMLVideoElement>();
const { duration } = useMediaControls(el);
const inMemoryFile = useInMemoryFile();

const url = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));

// if non login, only max 20seconds
const uploadToStorage = async () => {
  if (!file.value) return;
  try {
    const { data: assetData } = await client.storage
      .from("assets")
      .upload(`${user.value?.id}/${fileName.value}`, file.value, { upsert: true });
    const { data: transcriptionData } = await client.functions.invoke("transcribe", {
      body: {
        video_key: assetData?.path,
      },
    });
    const { data: projectData } = await client
      .from("projects")
      .insert({
        user_id: user.value?.id,
        video_key: assetData?.path,
        transcription_id: transcriptionData.id,
      })
      .select("id")
      .single();
    if (projectData?.id && url.value) {
      // save in-memory file into states
      inMemoryFile.value[projectData.id] = file.value;
      navigateTo(`/v/${projectData.id}`);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div>
    <button v-if="!file" @click="open()">select or drop file</button>

    <div v-else>
      <video ref="el" :src="url"></video>

      {{ duration }}

      <button @click="uploadToStorage">Upload</button>
    </div>
  </div>
</template>
