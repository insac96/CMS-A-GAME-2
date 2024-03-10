<template>
  <UForm 
    v-if="state && authStore.profile.type > 0" 
    :validate="validate" 
    :state="state" 
    @submit="editGlobal" 
    class="p-6"
  >
    <!-- Type -->
    <UFormGroup label="Loại" required name="type">
      <USelectMenu
        v-model="state.type"
        :options="typeSelectList"
        value-attribute="value"
        option-attribute="label"
        size="lg"
      >
        <template #label>{{ typeSelect ? typeSelect.label : 'Chọn loại thông báo' }}</template>
      </USelectMenu>
    </UFormGroup>

    <!-- Color -->
    <UFormGroup label="Màu sắc" name="color">
      <SelectColor v-model="state.color"/>
    </UFormGroup>

    <!-- Title -->
    <UFormGroup label="Tiêu đề" :hint="`${state.title ? state.title.length : 0}/20`" name="title">
      <UInput v-model="state.title" placeholder="Nhập tiêu đề ngắn hoặc để trống"/>
    </UFormGroup>

    <!-- Link -->
    <UFormGroup label="Đường dẫn" name="link">
      <UInput v-model="state.link" />
    </UFormGroup>

    <!-- Content -->
    <UFormGroup label="Nội dung" :hint="`${state.content ? state.content.length : 0}/200`" required name="content">
      <UTextarea v-model="state.content" autoresize name="input"/>
    </UFormGroup>

    <!-- Action -->
    <UiFlex class="mt-6">
      <SelectPin v-model="state.pin" />

      <UiFlex class="ml-auto">
        <UButton type="submit" :loading="loading" class="mr-1">Lưu</UButton>
        <UButton color="red" @click="deleteGlobal" :loading="loading" class="mr-1">Xóa</UButton>
        <UButton color="gray" @click="emit('cancel')" :disabled="loading">Đóng</UButton>
      </UiFlex>
    </UiFlex>
  </UForm>
</template>

<script setup>
const appConfig = useAppConfig()
const authStore = useAuthStore()
const emit = defineEmits(['done'])
const props = defineProps({
  notify: { type: Object }
})

const loading = ref(false)
const state = ref(props.notify ? JSON.parse(JSON.stringify(props.notify)) : undefined)

// Type Select
const typeSelectList = [
  { label: 'Mặc định', value: 0 },
  { label: 'Tin tức', value: 1, disabled: authStore.profile?.type < 1 },
  { label: 'Riêng tư', value: 2, disabled: authStore.profile?.type < 1 },
]
const typeSelect = computed(() => typeSelectList.find(i => i.value === state.value.type))

// Validate Form
const validate = (state) => {
  const errors = []
  if (state.type == undefined) errors.push({ path: 'type', message: 'Vui lòng chọn một loại' })
  if (!!state.title && state.title.length > 20) errors.push({ path: 'title', message: 'Tiêu đề từ 1-20 ký tự' })
  if (!state.content) errors.push({ path: 'content', message: 'Vui lòng điền đầy đủ thông tin' })
  if (state.content.length > 200) errors.push({ path: 'content', message: 'Nội dung tối đa 200 ký tự' })
  return errors
}

// Edit (Submit)
const editGlobal = async () => {
  try {
    if(loading.value) return
    loading.value = true

    await useAPI('notify/user/admin/editGlobal', JSON.parse(JSON.stringify(state.value)))
    loading.value = false
    emit('edit', state.value)
  }
  catch(e){
    loading.value = false
  }
}

// Delete
const deleteGlobal = async () => {
  try {
    if(loading.value) return
    loading.value = true

    await useAPI('notify/user/admin/delGlobal', { _id: state.value._id })
    loading.value = false
    emit('delete')
  }
  catch(e){
    loading.value = false
  }
}
</script>