<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div>
    <NuxtLink v-if="user" to="/home">
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

    <NuxtLink v-else to="/login" class="btn-primary">Login</NuxtLink>
  </div>
</template>
