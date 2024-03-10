<template>
  <UForm @submit="submit" :validate="validate" :state="state">
    <UFormGroup label="Máy chủ" name="server">
      <SelectGameServer v-model="state.server" />
    </UFormGroup>

    <UFormGroup label="Nhân vật" name="role" v-if="!!state.server && !!state.user">
      <SelectGameRole v-model="state.role" :server="state.server" :user="state.user" />
    </UFormGroup>

    <UFormGroup label="Tiêu đề" name="title">
      <UInput v-model="state.title" placeholder="Có thể để trống" />
    </UFormGroup>

    <UFormGroup label="Nội dung" name="content">
      <UInput v-model="state.content" placeholder="Có thể để trống" />
    </UFormGroup>

    <UFormGroup label="Lý do" name="reason">
      <UInput v-model="state.reason" />
    </UFormGroup>

    <UFormGroup name="items">
      <SelectItemList v-model="state.items" :types="['game_item']" />
    </UFormGroup>

    <UiFlex justify="end" class="mt-6">
      <UButton type="submit" :loading="loading" class="mr-1">Gửi</UButton>
      <UButton color="gray" @click="emits('close')">Đóng</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const props = defineProps(['user', 'server'])
const emits = defineEmits(['close'])
const loading = ref(false)

const state = ref({
  user: props.user,
  server: props.server || null,
  role: null,
  title: 'Quà từ GM',
  content: 'Chúc bạn chơi game vui vẻ',
  reason: null,
  items: []
})

const validate = (state) => {
  const errors = []
  if(!state.user) errors.push({ path: 'user', message: 'Vui lòng chọn tài khoản' })
  if(!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if(!!state.server && !state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  if(!state.reason) errors.push({ path: 'reason', message: 'Vui lòng nhập lý do' })
  if(state.items.length < 1) errors.push({ path: 'items', message: 'Vui lòng thêm vật phẩm' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('game/admin/send', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('close')
  }
  catch(e) {
    loading.value = false
  }
}
</script>