<template>
  <UiIcon name="i-bxs-circle" :color="color" :size="size" />
</template>

<script setup>
const props = defineProps({
  color: { type: String, default: 'primary' },
  size: { type: [ String, Number ], default: 3 },
})
</script>