<template>
  <USelectMenu 
    v-model="block" 
    size="lg" 
    value-attribute="value"
    placeholder="Chọn loại"
    :options="[
      { label: 'Có', value: 1 },
      { label: 'Không', value: 0 }
    ]"
  >
    <template #label>
      <span v-if="block === undefined">Chọn loại</span>
      <span v-else>{{ block == 1 ? 'Có' : 'Không' }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const block = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 
</script>