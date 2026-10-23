<script setup lang="ts">
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'
import { PALETTE_LABELS, PALETTE_NAMES, getPaletteColors } from '../themes'
import type { PaletteName } from '../types'

defineOptions({ name: 'ContributionPalettePicker' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Currently selected palette. */
      modelValue: PaletteName
      /** Legend of the fieldset. */
      label?: string
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    label: 'Color palette',
  },
)

const emit = defineEmits<{
  'update:modelValue': [palette: PaletteName]
}>()

const { cgAttrs } = useCgTheme(props)

function select(palette: PaletteName): void {
  if (palette === props.modelValue) return
  emit('update:modelValue', palette)
}

function swatchColor(palette: PaletteName): string {
  return getPaletteColors(palette)[3]
}

function optionStyle(palette: PaletteName): Record<string, string> {
  const color = swatchColor(palette)
  const style: Record<string, string> = { '--cg-picker-accent': color }
  if (palette === props.modelValue) style.borderColor = color
  return style
}
</script>

<template>
  <fieldset v-bind="cgAttrs" class="flex flex-wrap gap-2 border-0 p-0">
    <legend v-if="label" class="sr-only">{{ label }}</legend>
    <button
      v-for="option in PALETTE_NAMES"
      :key="option"
      type="button"
      class="flex min-h-[37px] min-w-[104px] flex-1 items-center justify-center rounded-[5px] border px-3 py-2.5 text-left font-cg-sans text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
      :class="
        option === modelValue
          ? 'border-cg-accent bg-cg-field font-semibold text-cg-text'
          : 'border-cg-border bg-cg-field text-cg-text hover:bg-cg-selected'
      "
      :style="optionStyle(option)"
      :aria-pressed="option === modelValue"
      @click="select(option)"
    >
      {{ PALETTE_LABELS[option] }}
    </button>
  </fieldset>
</template>
