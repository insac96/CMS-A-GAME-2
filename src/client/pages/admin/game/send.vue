<template>
  <UiContent 
    title="Send Item" 
    sub="Gửi vật phẩm cho người chơi" 
    class="max-w-4xl mx-auto"
  >
    <UForm @submit="submit" :validate="validate" :state="state">
      <UFormGroup label="Tiêu đề" name="title">
        <UInput v-model="state.title" placeholder="Có thể để trống" />
      </UFormGroup>

      <UFormGroup label="Nội dung" name="content">
        <UInput v-model="state.content" placeholder="Có thể để trống" />
      </UFormGroup>

      <UFormGroup label="Lý do" name="reason">
        <UTextarea v-model="state.reason" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="roles">
        <SelectGameRoles v-model="state.roles" />
      </UFormGroup>

      <UFormGroup label="Vật phẩm" name="items">
        <SelectItemList v-model="state.items" :types="['game_item']" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading" class="mr-1">Gửi Thư</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const loading = ref(false)

const state = ref({
  title: 'Quà từ GM',
  content: 'Chúc bạn chơi game vui vẻ',
  reason: null,
  roles: [],
  items: []
})

const validate = (state) => {
  const errors = []
  if(!state.reason) errors.push({ path: 'reason', message: 'Vui lòng nhập lý do' })
  if(state.roles.length < 1) errors.push({ path: 'roles', message: 'Vui lòng thêm nhân vật' })
  if(state.items.length < 1) errors.push({ path: 'items', message: 'Vui lòng thêm vật phẩm' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('game/admin/sendMulti', JSON.parse(JSON.stringify(state.value)))

    state.value.reason = null
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}
</script>