<template>
  <UCard>
    <UForm
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup label="Tài khoản" :hint="`${state.username ? state.username.length : 0}/15`" name="username">
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu" :hint="`${state.password ? state.password.length : 0}/15`" name="password">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UFormGroup label="Xác nhận mật khẩu" name="confirm_password">
        <UInput icon="i-bxs-lock-alt" v-model="state.confirm_password" type="password" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>

    <AuthSignSocial label="Hoặc đăng ký nhanh"/>

    <UModal v-model="modal" prevent-close>
      <UiFlex type="col" justify="center" class="p-6">
        <UiText color="primary" weight="bold" align="center" size="xl" class="mb-6">Thông Báo</UiText>

        <div class="mb-6 w-full max-h-[60vh] overflow-y-auto">
          <UiText color="gray" v-html="configStore.config.enable.notice_content"></UiText>
        </div>

        <UButton @click="modal = false; emit('done')">Xác Nhận</UButton>
      </UiFlex>
    </UModal>
  </UCard>
</template>

<script setup>
const { $socket } = useNuxtApp()
const configStore = useConfigStore()
const authStore = useAuthStore()

const props = defineProps(['landing'])
const emit = defineEmits(['done'])

const modal = ref(false)

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined,
  confirm_password: undefined,
  landing: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (state.username.length < 6 || state.username.length > 15) errors.push({ path: 'username', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.username.match(/\s/g)) errors.push({ path: 'username', message: 'Phát hiện khoảng cách' })
  else if (!(/^[a-z0-9]*$/g).test(state.username)) errors.push({ path: 'username', message: 'Phát hiện ký tự đặc biệt và viết hoa' })
  else if (!!state.username.includes('admin')
    || !!state.username.includes('smod')
    || !!state.username.includes('robot')
  ) errors.push({ path: 'username', message: 'Danh xưng không hợp lệ' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })

  if (!state.confirm_password) errors.push({ path: 'confirm_password', message: 'Vui lòng điền đầy đủ thông tin' })
  else if(state.confirm_password != state.password) errors.push({ path: 'confirm_password', message: 'Mật khẩu xác nhận không khớp' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true

    state.value.landing = props.landing
    await useAPI('auth/sign/landing/up', JSON.parse(JSON.stringify(state.value)))

    const auth = await useAPI('auth/get')
    authStore.setAuth(auth)
    $socket.emit('login', authStore.profile._id)

    loading.value = false
    if(!configStore.config.enable.notice) return emit('done')
    else return modal.value = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>