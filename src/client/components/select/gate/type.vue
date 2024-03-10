<template>
  <USelectMenu 
    v-model="type" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: 'Thẻ cào', value: 1 },
      { label: 'Ngân hàng', value: 2 },
      { label: 'Momo', value: 3 }
    ]"
  >
    <template #label>
      <UiText mini>
        <span v-if="!type">Chọn loại kênh</span>
        <span v-else-if="type == 1">Thẻ cào</span>
        <span v-else-if="type == 2">Ngân hàng</span>
        <span v-else-if="type == 3">Momo</span>
      </UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const type = ref(props.modelValue)
watch(type, (value) => {
  emit('update:modelValue', value)
})
</script>