<template>
  <main class="container" @mousedown="handleMouseDown">
    <ui-view />
    <map-view />
    <character-marker v-if="showCharacter" :position="characterPosition" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiView from './views/UiView.vue';
import MapView from './views/MapView.vue';
import CharacterMarker from './views/CharacterMarker.vue';

const showCharacter = ref(false);
const characterPosition = ref({ x: 0, y: 0 });

function handleMouseDown(event: MouseEvent) {
  if (event.ctrlKey) {
    event.preventDefault();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    characterPosition.value = { x, y };
    showCharacter.value = true;
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>