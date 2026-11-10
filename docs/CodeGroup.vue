<script setup lang="ts">
import { computed, ref } from 'vue'
import CodeBlock from './CodeBlock.vue'
const props = defineProps<{ snippets: { code: string; lang: string }[] }>()
const active = ref(0)
const selected = computed(() => props.snippets[active.value])
</script>
<template>
  <div>
    <div class="package-manager-picker" aria-label="Package manager">
      <button
        v-for="(snippet, index) in snippets"
        :key="snippet.lang"
        type="button"
        :class="{ selected: active === index }"
        :aria-pressed="active === index"
        @click="active = index"
      >
        {{ snippet.lang.match(/\[(.+)\]/)?.[1] ?? snippet.lang }}
      </button>
    </div>
    <CodeBlock v-if="selected" :code="selected.code" title="Terminal" />
  </div>
</template>
