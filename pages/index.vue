<script setup lang="ts">
useCustomHead("Vista | Add animated subtitle to your video automatically");
</script>

<template>
  <div>
    <div>
      <h1 class="mt-40 mb-20 text-6xl leading-tight">
        Add animated subtitle <br />
        to your video <span class="px-8 pt-2 pb-3 bg-blue-500 rounded-full text-white">automatically</span>
      </h1>
      <h2></h2>
    </div>

    <NuxtLink class="flex items-center justify-center" to="/create">
      <video src="~~/assets/original.mp4" autoplay muted class="h-128 rounded-3xl shadow-xl" loop></video>

      <div class="mx-10">
        <div class="i-bx-bxs-right-arrow-circle text-6xl text-blue-500"></div>
      </div>

      <video src="~~/assets/demo.mp4" autoplay muted class="h-128 rounded-3xl shadow-xl" loop></video>
    </NuxtLink>
  </div>
</template>
