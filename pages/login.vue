<script setup lang="ts">
import type { Provider } from "@supabase/gotrue-js";
const client = useSupabaseAuthClient();
const user = useSupabaseUser();

const login = async (provider: Provider) => {
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + "/home",
    },
  });
  if (error) {
    console.log("Something went wrong !");
  }
};

watch(
  user,
  () => {
    if (user.value?.id) navigateTo("/home");
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="mt-20 mb-12">Login</h1>

    <button @click="login('google')" class="btn-primary">Login with Google</button>
  </div>
</template>
