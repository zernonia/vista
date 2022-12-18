<script setup lang="ts">
import { animate, stagger } from "motion";

const props = defineProps({ active: Boolean });
const { active } = toRefs(props);

const stripCount = 5;

const startAnimation = () => {
  animate(".overlay", { display: "block" }, { duration: 0 });
  animate(".strip", { width: "100%" }, { delay: stagger(0.1), duration: 0.5 });
  animate(".overlay-content", { opacity: 1, scale: 1 }, { delay: 0.5, duration: 0.5 });
};

const closeAnimation = () => {
  animate(".overlay-content", { opacity: 0, scale: 0 }, { duration: 0.5 });
  animate(".strip", { width: "0%" }, { delay: stagger(0.1), duration: 0.5 });
  animate(".overlay", { display: "none" }, { delay: 0.5 });
};

watch(active, () => {
  if (active.value) {
    startAnimation();
  } else {
    closeAnimation();
  }
});
</script>

<template>
  <div class="hidden overlay w-screen h-screen fixed top-0 left-0 z-100">
    <div class="relative w-full h-full">
      <div
        v-for="i of stripCount"
        class="strip bg-gray-50 absolute left-0 w-0"
        :style="{ top: `${((i - 1) / 5) * 100}%`, height: `${100 / 5}vh` }"
      ></div>

      <div class="overlay-content absolute w-full h-full flex items-center justify-center scale-0 opacity-0">
        <slot>Slot content </slot>
      </div>
    </div>
  </div>
</template>
