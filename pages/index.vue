<script setup lang="ts">
const client = useSupabase();

const { data } = useAsyncData(async () => {
  const { data } = await client.from("projects").select("*");
  return data;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <User></User>

    <NuxtLink to="/create">Create</NuxtLink>
    <div>my projects</div>

    <div class="flex flex-col">
      <NuxtLink v-for="item in data" :to="`/v/${item.id}`">
        {{ item.id }}
      </NuxtLink>
    </div>
  </div>
</template>
