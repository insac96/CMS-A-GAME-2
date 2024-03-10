<template>
  <UCard>
    <template #header>
      <UiText size="base" weight="semibold">Quên Mật Khẩu</UiText>
      <UiText size="sm" color="gray">Sử dụng số điện thoại đã đăng ký để đặt lại mật khẩu</UiText>
    </template>

    <UForm
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup label="Tài khoản" name="username">
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Điện thoại" name="phone">
        <UInput icon="i-bxs-phone" v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu mới" name="password" :hint="`${state.password ? state.password.length : 0}/15`">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>
  </UCard>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const emit = defineEmits(['done'])

const loading = ref(false)

const state = ref({
  username: undefined,
  phone: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng điền đầy đủ thông tin' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng điền đầy đủ thông tin' })
  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/sign/forgot', JSON.parse(JSON.stringify(state.value)))

    const auth = await useAPI('auth/get')
    authStore.setAuth(auth)
    $socket.emit('login', authStore.profile._id)

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>