<template>
  <UiFlex type="col" class="min-h-full overflow-hidden py-4">
    <UiFlex class="w-full mb-6" justify="center">
      <NuxtLink to="/">
        <UiLogo @click="open = false" />
      </NuxtLink>
    </UiFlex>

    <DataUserPanel v-if="!!authStore.isLogin" class="mb-4" />

    <div class="grow w-full py-4 overflow-x-hidden overflow-y-auto py-4">
      <DataPaymentPanel class="w-full" />
      <DataShopPanel class="w-full" />
      <DataEventPanel class="w-full" />
      <DataGiftcodePanel class="w-full" />
      <DataMinigameWheelPanel class="w-full" />
    </div>

    <div class="w-full px-3">
      <UiFlex justify="center" class="gap-0.5 mb-4">
        <UiImg 
          class="max-w-[45px] max-h-[45px] cursor-pointer rounded-full"
          src="/images/social/facebook.png"
          w="1" h="1"
          imgW="80" imgH="80"
          alt="FB"
          @click="openLink(configStore.config.social.facebook)"
        ></UiImg>

        <UiImg 
          class="max-w-[45px] max-h-[45px] cursor-pointer rounded-full"
          src="/images/social/zalo.png"
          w="1" h="1"
          imgW="80" imgH="80"
          alt="FB"
          @click="openLink(configStore.config.social.zalo)"
        ></UiImg>
      </UiFlex>

      <div v-if="!!authStore.isLogin">
        <UButton color="gray" block class="mb-1" v-if="authStore.profile.type > 0" @click="goToAdmin(authStore.profile.type)">Quản Trị Viên</UButton>
        <UButton color="red" block @click="logout">Đăng Xuất</UButton>
      </div>
    </div>
  </UiFlex>
</template>

<script setup>
const emit = defineEmits(['to'])
const configStore = useConfigStore()
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

const openLink = (url) => {
  window.open(url, '_blank')
}
</script>