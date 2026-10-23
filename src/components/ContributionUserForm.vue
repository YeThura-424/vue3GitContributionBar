<script setup lang="ts">
import { useId } from 'vue'

import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'

defineOptions({ name: 'ContributionUserForm' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Current username, without the leading `@`. */
      modelValue?: string
      /** Show the busy state on the submit button. */
      loading?: boolean
      /** Label above the input. */
      label?: string
      /** Placeholder of the input. */
      placeholder?: string
      /** Label of the submit button. */
      buttonLabel?: string
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    modelValue: '',
    loading: false,
    label: 'GitHub username',
    placeholder: 'username',
    buttonLabel: 'Load profile',
  },
)

const emit = defineEmits<{
  'update:modelValue': [username: string]
  submit: [username: string]
}>()

const { cgAttrs } = useCgTheme(props)
const inputId = useId()

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

function onSubmit(): void {
  emit('submit', props.modelValue)
}
</script>

<template>
  <form v-bind="cgAttrs" class="flex flex-col gap-3" @submit.prevent="onSubmit">
    <label :for="inputId" class="font-cg-sans text-sm text-cg-text">{{ label }}</label>

    <div
      class="flex h-[47px] items-center gap-2.5 rounded-[5px] border border-cg-border bg-cg-field px-3.5 transition-colors focus-within:border-cg-accent"
    >
      <span class="font-cg-mono text-[15px] font-bold text-cg-accent" aria-hidden="true">@</span>
      <input
        :id="inputId"
        type="text"
        class="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-cg-mono text-sm font-bold text-cg-text outline-none placeholder:text-cg-muted disabled:cursor-wait disabled:opacity-50"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="loading"
        autocomplete="off"
        spellcheck="false"
        required
        @input="onInput"
      />
    </div>

    <button
      type="submit"
      class="h-12 w-full rounded-[5px] border border-cg-accent bg-cg-accent font-cg-sans font-semibold text-cg-accent-ink transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent active:brightness-90 disabled:cursor-wait disabled:opacity-50"
      :disabled="loading"
    >
      {{ loading ? 'Loading…' : buttonLabel }}
    </button>
  </form>
</template>
