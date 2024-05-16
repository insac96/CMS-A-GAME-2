<template>
  <UCard>
    <UForm :validate="validate" :state="state" @submit="submit">
      <UFormGroup label="Tài khoản" name="username">
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu" name="password">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>

    <AuthSignSocial />

    <UModal v-model="modal" prevent-close>
      <UiFlex type="col" justify="center" class="p-6">
        <UiText color="primary" weight="bold" align="center" size="xl" class="mb-6">Thông Báo</UiText>

        <div class="mb-6 w-full max-h-[60vh] overflow-y-auto">
          <UiText color="gray" v-html="configStore.config.enable.notice_content"></UiText>
        </div>

        <UButton @click="modal = false; emit('done')">Chơi Ngay</UButton>
      </UiFlex>
    </UModal>
  </UCard>
</template>

<script setup>
const { $socket } = useNuxtApp()
const configStore = useConfigStore()
const authStore = useAuthStore()

const props = defineProps(['landing','notice_system'])
const emit = defineEmits(['done'])

const modal = ref(false)

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined,
  landing: undefined
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

    state.value.landing = props.landing
    await useAPI('auth/sign/landing/in', JSON.parse(JSON.stringify(state.value)))

    const auth = await useAPI('auth/get')
    authStore.setAuth(auth)
    $socket.emit('login', authStore.profile._id)

    loading.value = false

    if(!!props.notice_system){
      if(!configStore.config.enable.notice) return emit('done')
      else return modal.value = true
    }
    else {
      return emit('done')
    }
  }
  catch (e) {
    loading.value = false
  }
}
</script>