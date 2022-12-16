<script setup lang="ts">
const { config } = useConfig();
</script>

<template>
  <div>
    <h2>Config</h2>

    <div>
      <input type="number" v-model="config.style.fontWeight" step="100" max="900" min="100" name="top" id="top" />
      <input type="number" v-model="config.style.top" name="top" id="top" />
      <input type="color" v-model="config.style.backgroundColor" name="top" id="top" />
      <input type="color" v-model="config.style.color" name="top" id="top" />
      <input type="color" v-model="config.highlight_style.color" name="top" id="top" />
    </div>
  </div>
</template>
