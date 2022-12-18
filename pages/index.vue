<script setup lang="ts">
const client = useSupabase();

const { data } = useAsyncData(async () => {
  const { data } = await client.from("projects").select("id, title");
  return data;
});
</script>

<template>
  <div>simple and quick landing page</div>
</template>
