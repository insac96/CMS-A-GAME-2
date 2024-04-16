<template>
  <div>
    <UForm
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup name="username">
        <UInput icon="i-bx-user" v-model="state.username" placeholder="Tên tài khoản" />
      </UFormGroup>

      <UFormGroup name="email">
        <UInput icon="i-bx-envelope" v-model="state.email" placeholder="Địa chỉ Email" />
      </UFormGroup>

      <UFormGroup name="phone">
        <UInput icon="i-bx-phone" v-model="state.phone" placeholder="Số điện thoại" />
      </UFormGroup>

      <UFormGroup name="password">
        <UInput icon="i-bx-lock" v-model="state.password" type="password" placeholder="Nhập mật khẩu" />
      </UFormGroup>

      <UiFlex justify="between">
        <UiText size="xs" color="gray" class="cursor-pointer" @click="emit('in')">Đã có tài khoản?</UiText>
        <UButton color="gray" type="submit" :loading="loading.signup">Đăng Ký</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal" prevent-close>
      <UiFlex type="col" justify="center" class="p-6">
        <UiText color="primary" weight="bold" align="center" size="xl" class="mb-6">Thông Báo</UiText>

        <div class="mb-6 w-full max-h-[60vh] overflow-y-auto">
          <UiText color="gray" v-html="configStore.config.enable.notice_content"></UiText>
        </div>

        <UButton @click="modal = false; emit('done'); play()">Xác Nhận</UButton>
      </UiFlex>
    </UModal>
  </div>
</template>

<script setup>
const { $socket } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const emit = defineEmits(['done', 'in'])

const modal = ref(false)

const loading = ref({
  signup: false,
  start: false
})

const timewait = ref(10)
const timming = ref(undefined)

const state = ref({
  username: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
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
  ) errors.push({ path: 'username', message: 'Tên tài khoản chứa ký tự cấm' })

  if (!state.email) errors.push({ path: 'email', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: 'Định dạng Email không đúng' })

  if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: 'Định dạng số điện thoại không đúng' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng điền đầy đủ thông tin' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })

  return errors
}

const startTimeWait = () => {
  timming.value = setInterval(() => {
    if(timewait.value == 0){
      clearInterval(timming.value)
      timewait.value = 0
    }
    else {
      timewait.value--
    }
  }, 1000)
}

const submit = async () => {
  try {
    loading.value.signup = true
    await useAPI('auth/sign/up', JSON.parse(JSON.stringify(state.value)))
    start()
  }
  catch (e) {
    loading.value.signup = false
  }
}

const start = async () => {
  try {
    loading.value.start = true
    const auth = await useAPI('auth/get')
    
    authStore.setAuth(auth)
    $socket.emit('login', authStore.profile._id)

    loading.value.start = false

    if(!configStore.config.enable.notice) return play()
    else return modal.value = true
  }
  catch(e){
    loading.value.start = false
  }
}

const play = async () => {
  try {
    await useAPI('game/start')

    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    useTo().navigateToSSL('/')
  }
}
</script>