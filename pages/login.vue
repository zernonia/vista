<script setup lang="ts">
import type { Provider } from "@supabase/gotrue-js";
const client = useSupabaseAuthClient();

const login = async (provider: Provider) => {
  const { error } = await client.auth.signInWithOAuth({ provider });
  if (error) {
    console.log("Something went wrong !");
  }
};
</script>

<template>
  <button @click="login('google')">Login with Google</button>
</template>
