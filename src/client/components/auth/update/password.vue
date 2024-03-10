<template>
  <UCard>
    <template #header>
      <UiText size="base" weight="semibold">Đổi mật khẩu</UiText>
      <UiText size="sm" color="gray">Sử dụng mật khẩu cũ để đặt lại mật khẩu</UiText>
    </template>

    <UForm
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup label="Mật khẩu cũ" name="old">
        <UInput icon="i-bxs-lock" v-model="state.old" type="password"/>
      </UFormGroup>

      <UFormGroup label="Mật khẩu mới" name="new" :hint="`${state.new ? state.new.length : 0}/15`">
        <UInput icon="i-bxs-lock" v-model="state.new" type="password" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>
  </UCard>
</template>

<script setup>
const { setAuth } = useAuthStore()
const emit = defineEmits(['done'])

const loading = ref(false)

const state = ref({
  old: undefined,
  new: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.old) errors.push({ path: 'old', message: 'Vui lòng điền đầy đủ thông tin' })
  if (!state.new) errors.push({ path: 'new', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (state.new.length < 6 || state.new.length > 15) errors.push({ path: 'new', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.new.match(/\s/g)) errors.push({ path: 'new', message: 'Phát hiện khoảng cách' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/update/password', JSON.parse(JSON.stringify(state.value)))

    const auth = await useAPI('auth/get')
    setAuth(auth)

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>