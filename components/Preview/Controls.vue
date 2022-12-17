<script setup lang="ts">
import Slider from "@vueform/slider";
const { duration, currentTime, playing } = usePlayback();

const disabledTagName = ["BUTTON", "A", "INPUT"];

onKeyStroke(
  " ",
  (e) => {
    if (
      activeElement.value &&
      !disabledTagName.includes(activeElement.value?.tagName) &&
      !activeElement.value.hasAttribute("contenteditable")
    ) {
      playing.value = !playing.value;
    }
  },
  { eventName: "keyup" }
);
const activeElement = useActiveElement();

const format = (value: number) => value.toFixed(2);
</script>

<template>
  <div class="w-full flex items-center mt-8">
    <button @click="playing = !playing" class="rounded-full bg-blue-100 text-blue p-1 flex items-center justify-center">
      <div v-if="!playing" class="i-bx-play text-4xl"></div>
      <div v-else class="i-bx-pause text-4xl"></div>
    </button>
    <Slider
      class="ml-6 w-full"
      :format="format"
      v-model="currentTime"
      :max="duration"
      showTooltip="focus"
      :step="0.001"
    ></Slider>
  </div>
</template>
