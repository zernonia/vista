<script setup lang="ts">
import Slider from "@vueform/slider";
const { config } = useConfig();
// @ts-ignore
import { ColorPicker } from "vue3-colorpicker";
// @ts-ignore
import "vue3-colorpicker/style.css";

const { videoWidth, videoHeight, ratio } = usePlayback();
</script>

<template>
  <div class="flex flex-col">
    <label for="size">Font Size</label>
    <div class="flex items-center">
      <input type="number" v-model="config.style.fontSize" min="1" name="size" id="size" />
      <span class="ml-2">px</span>
    </div>

    <label for="weight">Font Weight</label>
    <input type="number" v-model="config.style.fontWeight" step="100" max="900" min="100" name="weight" id="weight" />

    <div class="w-full flex items-center space-x-4">
      <div class="flex flex-col">
        <label for="left">X</label>
        <div class="flex items-center">
          <input type="number" v-model="config.style.left" name="left" id="left" />
          <span class="ml-2">px</span>
        </div>
        <Slider
          class="mt-4"
          :lazy="false"
          v-model="config.style.left"
          showTooltip="focus"
          :min="-480"
          :max="480"
        ></Slider>
      </div>
      <div class="flex flex-col">
        <label for="top">Y</label>
        <div class="flex items-center">
          <input type="number" v-model="config.style.top" name="top" id="top" />
          <span class="ml-2">px</span>
        </div>
        <Slider
          class="mt-4"
          :lazy="false"
          v-model="config.style.top"
          showTooltip="focus"
          :min="-400"
          :max="1400"
        ></Slider>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-4">
      <div class="flex flex-col">
        <label for="bg-color">Background</label>
        <ColorPicker id="bg-color" v-model:pure-color="config.style.backgroundColor" />
      </div>

      <div class="flex flex-col">
        <label for="text-color">Text</label>
        <ColorPicker id="text-color" v-model:pure-color="config.style.color" />
      </div>

      <div class="flex flex-col">
        <label for="highlight-color">Highlight</label>
        <ColorPicker id="highlight-color" v-model:pure-color="config.highlight_style.color" />
      </div>
    </div>
  </div>
</template>
