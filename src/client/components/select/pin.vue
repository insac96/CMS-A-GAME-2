<template>
  <UiFlex>
    <UToggle v-model="pin" class="mr-2" />
    <UiText size="sm" weight="semibold" color="gray" text="Ghim" />
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  modelValue: Number
})
const emit = defineEmits(['update:modelValue'])

const pin = computed({
  get: () => props.modelValue == 1 ? true : false,
  set: (value) => emit('update:modelValue', !!value ? 1 : 0)
}) 
</script>