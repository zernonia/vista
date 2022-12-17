<script setup lang="ts"></script>

<template>
  <div class="bg-white">
    <div class="px-12 py-6 max-w-screen-lg mx-auto">
      <header class="flex items-center justify-between">
        <NuxtLink to="/">Vista</NuxtLink>

        <User></User>
      </header>
      <div class="mt-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
