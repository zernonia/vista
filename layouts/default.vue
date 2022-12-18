<script setup lang="ts"></script>

<template>
  <div class="bg-white">
    <div class="px-12 py-6 max-w-screen-lg mx-auto">
      <header class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <img class="w-12 h-12" src="~~/assets/logo.svg" alt="Vista logo" />
          <span class="ml-4 font-bold text-4xl text-blue-500">Vista</span>
        </NuxtLink>

        <User></User>
      </header>
      <div class="mt-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
