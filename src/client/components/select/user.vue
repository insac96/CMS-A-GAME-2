<template>
  <UiFlex>
    <USelectMenu
      v-model="userSelect"
      :searchable="searchUser"
      :multiple="props.multiple"
      size="lg"
      by="_id"
      class="grow"
    >
      <template #label>
        <div v-if="!!props.multiple">
          <span v-if="select && select.length > 0" class="truncate">{{ select.map(i => i.label).join(', ') }}</span>
          <span v-else>Tìm kiếm tài khoản</span>
        </div>

        <div v-else>
          <span v-if="select">{{ select.label }}</span>
          <span v-else>Tìm kiếm tài khoản</span>
        </div>
      </template>
    </USelectMenu>

    <UButton
      v-if="(!props.multiple && !!userSelect) || (!!props.multiple && userSelect.length > 0)"
      icon="i-bx-x"
      color="gray" 
      class="ml-1" 
      size="lg" 
      @click="reset"
    ></UButton>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  modelValue: [ String, Array ],
  userData: Object,
  multiple: Boolean,
})

const emit = defineEmits(['update:modelValue', 'update:userData'])
const userSelect = ref(props.modelValue)
const select = ref(undefined)

watch(userSelect, val => {
  select.value = val
  if(!!props.multiple){
    const list = val.map(i => i._id)
    emit('update:modelValue', list)
  }
  else {
    if(!!val) return emit('update:modelValue', val._id)
    emit('update:modelValue', undefined)
  }
})

watch(select, val => {
  if(!!props.multiple) return
  if(!val) return emit('update:userData', undefined)
  emit('update:userData', {
    _id: val._id,
    username: val.label
  })
})

const reset = () => {
  if(!!props.multiple){
    userSelect.value = []
  }
  else {
    userSelect.value = undefined
  }
}

const searchUser = async (key) => {
  const users = await useAPI('user/search', {
    key: key
  })
  return users.map(user => ({ _id: user._id, label: user.username })).filter(Boolean)
}
</script>