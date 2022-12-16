<script setup lang="ts">
const { config } = useConfig();
// @ts-ignore
import { ColorPicker } from "vue3-colorpicker";
// @ts-ignore
import "vue3-colorpicker/style.css";
</script>

<template>
  <div class="flex flex-col">
    <label for="weight">Font Weight</label>
    <input type="number" v-model="config.style.fontWeight" step="100" max="900" min="100" name="weight" id="weight" />

    <label for="size">Font Size</label>
    <div class="flex items-center">
      <input type="number" v-model="config.style.fontSize" min="1" name="size" id="size" />
      <span class="ml-2">px</span>
    </div>

    <div class="w-full flex items-center space-x-4">
      <div class="flex flex-col">
        <label for="left">X</label>
        <div class="flex items-center">
          <input type="number" v-model="config.style.left" name="left" id="left" />
          <span class="ml-2">px</span>
        </div>
      </div>
      <div class="flex flex-col">
        <label for="top">Y</label>
        <div class="flex items-center">
          <input type="number" v-model="config.style.top" name="top" id="top" />
          <span class="ml-2">px</span>
        </div>
      </div>
    </div>

    <label for="bg-color">Background color</label>
    <ColorPicker id="bg-color" v-model:pure-color="config.style.backgroundColor" />

    <label for="text-color">Text color</label>
    <ColorPicker id="text-color" v-model:pure-color="config.style.color" />

    <label for="highlight-color">Highlight color</label>
    <ColorPicker id="highlight-color" v-model:pure-color="config.highlight_style.color" />
  </div>
</template>
