<template>
  <div class="w-full h-full fixed top-0 left-0" v-if="!!landing">
    <iframe 
      title="Landing Page"
      :src="landing.link"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="openSign"></div>

    <UModal v-model="modal">
      <div class="p-2">
        <UTabs v-model="tabItem" :items="tabItems"></UTabs>
        <AuthSignLandingIn @done="thankyou" :landing="landing._id" v-if="tabItem == 0" />
        <AuthSignLandingUp @done="thankyou" :landing="landing._id" v-if="tabItem == 1" />
        <DataGiftcodePublic v-if="tabItem == 2"></DataGiftcodePublic>
      </div>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'ads',
})

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()
const modal = ref(false)
const landing = ref(undefined)

const tabItem = ref(1) 
const tabItems = [
  { label: 'Đăng Nhập', key: 'in' },
  { label: 'Đăng Ký', key: 'up' },
  { label: 'Giftcode', key: 'giftcode' },
]

const openSign = () => {
  if(!!authStore.isLogin) return start()
  modal.value = true
}

const thankyou = async () => {
  useTo().navigateToSSL('/thankyou')
}

const start = async () => {
  try {
    await useAPI('game/start')

    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    useTo().navigateToSSL('/')
  }
}

const getLanding = async () => {
  try {
    const data = await useAPI('ads/landing/code', { code: route.params.code })
    landing.value = data
  }
  catch (e) {
    return false
  }
}
getLanding()
</script>