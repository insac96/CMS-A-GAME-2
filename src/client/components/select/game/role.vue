<template>
  <USelectMenu
    v-model="role"
    :options="options"
    size="lg"
    value-attribute="value"
    option-attribute="label"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : 'Chọn nhân vật' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue', 'roleData', 'server', 'user'])
const emit = defineEmits(['update:modelValue', 'update:roleData'])

const loading = ref(true)

const role = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 

const options = ref([])

const select = computed(() => options.value.find(i => i.value === role.value))

watch(select, val => {
  if(!val) return emit('update:roleData', undefined)
  emit('update:roleData', {
    role_id: val.value,
    role_name: val.label
  })
})

watch(() => props.server, (val) => !!val && fetch())
watch(() => props.user, (val) => !!val && fetch())

const fetch = async () => {
  try {
    if(!props.server) return

    loading.value = true
    const list = await useAPI('game/role', { server: props.server, user: props.user })

    loading.value = false
    options.value = list.map(i => ({ value: i.role_id, label: i.role_name }))

    if(options.value.length == 1){
      role.value = options.value[0].value
    }
  }
  catch (e) {
    loading.value = false
    options.value = []
  }
}

fetch()
</script>