---
outline: false
---

# Component previews

These interactive examples use deterministic sample data, so they work without a GitHub request.
Drag to orbit, scroll to zoom, or hover a bar for its contribution count.

<script setup lang="ts">
import { ContributionGraph3D, ContributionLegend, useSampleContributions } from 'vue-contribution-graph-3d'

const days = useSampleContributions(2025, 42)
const palettes = ['forest', 'daylight', 'midnight'] as const
</script>

<section v-for="palette in palettes" :key="palette" :id="palette" class="cg-doc-card cg-preview">
  <h2>{{ palette.charAt(0).toUpperCase() + palette.slice(1) }}</h2>
  <ContributionGraph3D :data="days" :palette="palette" :animate="false" height="320px" />
  <ContributionLegend :palette="palette" />
</section>

<style scoped>
.cg-preview {
  margin-top: 24px;
}
.cg-preview h2 {
  margin: 0 0 16px;
  border: 0;
  padding: 0;
}
</style>
