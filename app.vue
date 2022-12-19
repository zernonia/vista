<script setup lang="ts">
const { name } = toRefs(useRoute());
const routeName = computed(
  () => name.value && name.value.toString().charAt(0).toLocaleUpperCase() + name.value.toString().slice(1)
);

useHead({
  titleTemplate: (title) => `${title ?? routeName.value} | Vista`,
  link: [{ rel: "icon", href: "/logo.svg" }],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
