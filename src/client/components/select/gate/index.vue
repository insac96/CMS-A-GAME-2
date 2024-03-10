<template>
  <USelectMenu
    v-model="gate"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="name"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.name : 'Chọn kênh nạp' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  gate: Object,
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:gate'])

const loading = ref(true)

const gate = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('update:gate', options.value.find(i => i._id === value))
  } 
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === gate.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('gate/select')

    options.value = options.value.concat(list)
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
fetch()
</script>