<template>
  <UiFlex type="col" class="px-4 py-10 border rounded-xl border-gray-200 dark:border-gray-800 border-dashed">
    <UiIcon :name="icon" color="primary" size="16" class="mb-2 opacity-75 dark:opacity-50" v-if="icon" />
    <UiText color="gray" align="center" size="sm">{{ text }}</UiText>
  </UiFlex>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'i-bx-data'
  },
  text: {
    type: String,
    default: 'Không có dữ liệu'
  }
})
</script>