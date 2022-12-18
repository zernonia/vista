<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <NuxtLink to="/home">
    <img
      class="rounded-full w-14"
      referrerpolicy="no-referrer"
      crossorigin="anonymous"
      :src="user?.user_metadata?.avatar_url"
      :alt="user?.email"
      v-if="user?.user_metadata?.avatar_url"
    />
    <span v-else>{{ user?.email }}</span>
  </NuxtLink>
</template>
