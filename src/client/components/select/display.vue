<template>
  <USelectMenu 
    v-model="display" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: 'Hiện', value: 1 },
      { label: 'Ẩn', value: 0 }
    ]"
  >
    <template #label>
      <span v-if="display === undefined">Chọn loại</span>
      <span v-else>{{ display == 1 ? 'Hiện' : 'Ẩn' }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const display = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 
</script>