<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div>
    <img
      class="rounded-full w-14"
      referrerpolicy="no-referrer"
      crossorigin="anonymous"
      :src="user?.user_metadata?.avatar_url"
      :alt="user?.email"
    />
  </div>
</template>
