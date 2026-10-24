<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <span class="ytr" :class="`ytr--${size}`" role="img" aria-label="YTR contribskyline">
    <span class="ytr__badge" aria-hidden="true">
      <svg class="ytr__chevron" viewBox="0 0 16 20" fill="currentColor">
        <path d="M8 2h8l-8 8 8 8H8L0 10z" />
      </svg>
      <span class="ytr__initials">YTR</span>
      <span class="ytr__slash">/</span>
      <svg class="ytr__chevron" viewBox="0 0 16 20" fill="currentColor">
        <path d="M0 2h8l8 8-8 8H0l8-8z" />
      </svg>
    </span>
    <span class="ytr__wordmark" aria-hidden="true">
      <span class="ytr__contrib">contrib</span><span class="ytr__skyline">skyline</span>
    </span>
  </span>
</template>

<style scoped>
.ytr {
  --ytr-accent: var(--vp-c-brand-1);
  --ytr-contrib: var(--vp-c-text-1);
  --ytr-skyline: var(--vp-c-brand-1);
  --ytr-font-weight: 700;
  --ytr-gap: 10px;
  --ytr-badge-font-size: 18px;
  --ytr-wordmark-font-size: 24px;

  display: inline-flex;
  align-items: center;
  gap: var(--ytr-gap);
  flex: none;
  white-space: nowrap;
}

.ytr__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  color: var(--ytr-accent);
  border: 1px solid color-mix(in srgb, var(--ytr-accent) 28%, var(--vp-c-divider));
  border-radius: 5px;
  padding: 0.3em 0.4em;
  background: color-mix(in srgb, var(--ytr-accent) 6%, var(--vp-c-bg));
  gap: 0.14em;
  font-family: var(--vp-font-family-base);
  font-size: var(--ytr-badge-font-size);
  font-weight: var(--ytr-font-weight);
  line-height: 1;
  letter-spacing: -0.045em;
}

.ytr__chevron {
  display: block;
  flex: none;
  width: 0.48em;
  height: 0.6em;
}

.ytr__initials {
  margin-left: 0.1em;
}

.ytr__slash {
  font-size: 1.35em;
  line-height: 0.8;
}

.ytr__wordmark {
  display: inline-flex;
  align-items: baseline;
  font-family: var(--vp-font-family-base);
  font-size: var(--ytr-wordmark-font-size);
  line-height: 1;
  letter-spacing: -0.055em;
}

.ytr__contrib {
  color: var(--ytr-contrib);
  font-weight: var(--ytr-font-weight);
}

.ytr__skyline {
  color: var(--ytr-skyline);
  font-weight: var(--ytr-font-weight);
}

.ytr--sm {
  --ytr-gap: 8px;
  --ytr-badge-font-size: 16px;
  --ytr-wordmark-font-size: 20px;
}

.ytr--lg {
  --ytr-gap: 16px;
  --ytr-badge-font-size: 30px;
  --ytr-wordmark-font-size: 42px;
}

@media (max-width: 639px) {
  .ytr {
    --ytr-gap: 10px;
    --ytr-badge-font-size: 16px;
    --ytr-wordmark-font-size: 20px;
  }
}
</style>
