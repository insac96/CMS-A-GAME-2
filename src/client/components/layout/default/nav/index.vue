<template>
  <UiFlex type="col" class="min-h-full overflow-x-hidden py-4">
    <UiFlex class="w-full mb-6" justify="center">
      <NuxtLink to="/">
        <UiLogo @click="open = false" />
      </NuxtLink>
    </UiFlex>

    <!-- <PlayBtn class="mb-6" /> -->

    <DataUserPanel v-if="!!authStore.isLogin" class="mb-6" />

    <DataPaymentPanel class="w-full" />

    <DataShopPanel class="w-full" />

    <DataEventPanel class="w-full" />

    <DataGiftcodePanel class="w-full" />

    <div class="w-full mt-auto px-3" v-if="!!authStore.isLogin">
      <UButton color="gray" block class="mb-1" v-if="authStore.profile.type > 0" @click="goToAdmin(authStore.profile.type)">Quản Trị Viên</UButton>
      <UButton color="red" block @click="logout">Đăng Xuất</UButton>
    </div>
  </UiFlex>
</template>

<script setup>
const emit = defineEmits(['to'])
const authStore = useAuthStore()
const runtimeConfig = useRuntimeConfig()

const logout = async () => {
  await useAPI('auth/sign/out')
  authStore.removeAuth()
  window.location.href = `${runtimeConfig.public.clientURL}`
}

const goToAdmin = (type) => {
  if(type < 1) return
  window.location.href = `${runtimeConfig.public.clientURL}/admin`
}
</script>