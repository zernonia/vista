<script setup lang="ts">
const client = useSupabase();

const { data } = useAsyncData(async () => {
  const { data } = await client.from("projects").select("id, title").order("created_at", { ascending: false });
  return data;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-center my-4 font-bold text-5xl text-dark-50">My projects</h1>
    <NuxtLink class="btn-primary" to="/create">Create</NuxtLink>

    <div class="flex flex-col mt-12">
      <NuxtLink class="btn-plain mb-3" v-for="item in data" :to="`/v/${item.id}`">
        {{ item.title ?? item.id }}
      </NuxtLink>
    </div>
  </div>
</template>
