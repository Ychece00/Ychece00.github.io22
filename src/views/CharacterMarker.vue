<template>
    <div
      :style="`position: absolute; left: ${position.x}px; top: ${position.y}px; width: 50px; height: 50px; background-color: red; color: white; text-align: center; line-height: 50px; font-size: 24px;`"
    >
      q
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref } from 'vue';
  
  const props = defineProps<{ position: { x: number; y: number } }>();
  </script>
  
  <style scoped>
  div {
    transition: left 0.1s linear, top 0.1s linear;
  }
  </style>