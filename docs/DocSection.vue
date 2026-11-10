<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{ id: string; title: string; content: Component }>()
</script>
<template>
  <section :id="id" class="docs-section reference-section">
    <component :is="content" />
  </section>
</template>
