<template>
  <USelectMenu
    v-model="color"
    :options="colorList"
    size="lg"
  >
    <template #label>
      <UiDot v-if="color" :color="color" />
      <span class="capitalize" v-if="color">{{ color }}</span>
      <span v-else>{{ placeholder || 'Chọn màu sắc' }}</span>
    </template>

    <template #option="{ option: option }">
      <UiDot :color="option" />
      <span class="capitalize">{{ option }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue', 'placeholder'])
const emit = defineEmits(['update:modelValue'])
const appConfig = useAppConfig()

const colorList = computed(() => {
  const list = appConfig.ui.colors.map(color => color)
  list.push('gray')
  return list
})

const color = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 
</script>