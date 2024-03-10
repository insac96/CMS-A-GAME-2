<template>
  <USelectMenu
    v-model="item"
    searchable
    :options="options"
    size="sm"
    value-attribute="_id"
    option-attribute="name"
  >
    <template #label>
      <UiText mini>{{ select ? select.name : 'Chọn gói quà' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const emit = defineEmits(['change'])

const options = ref([])

const item = ref(null)

const select = computed(() => options.value.find(i => i._id === item.value))

watch(item, (val) => {
  if(!val) return
  const box = options.value.find(i => i._id === val)
  emit('change', box ? box.gift : [])
  item.value = null
})

const fetch = async () => {
  const items = await useAPI('item/box/select')
  options.value = items
}

fetch()
</script>