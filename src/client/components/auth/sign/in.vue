<template>
  <div>
    <UForm :validate="validate" :state="state" @submit="submit">
      <UFormGroup name="username">
        <UInput icon="i-bx-user" v-model="state.username" placeholder="Tên tài khoản" />
      </UFormGroup>

      <UFormGroup name="password">
        <UInput icon="i-bx-lock" v-model="state.password" type="password" placeholder="Nhập mật khẩu" />
      </UFormGroup>

      <UiFlex justify="between">
        <UiText size="xs" color="gray" class="cursor-pointer" @click="emit('up')">Chưa có tài khoản?</UiText>
        <UButton color="gray" type="submit" :loading="loading">Đăng Nhập</UButton>
      </UiFlex>
    </UForm>

    <AuthSignSocial />
  </div>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const emit = defineEmits(['done', 'up'])

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng điền đầy đủ thông tin' })
  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng điền đầy đủ thông tin' })
  return errors
}

const submit = async () => {
  try {
    if(!!loading.value) return
    loading.value = true

    await useAPI('auth/sign/in', JSON.parse(JSON.stringify(state.value)))

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