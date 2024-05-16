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
        <AuthSignLandingIn @done="thankyou" :landing="landing._id" :notice_system="landing.notice_system" v-if="tabItem == 0" />
        <AuthSignLandingUp @done="thankyou" :landing="landing._id" :notice_system="landing.notice_system" v-if="tabItem == 1" />
        <DataGiftcodePublic v-if="tabItem == 2"></DataGiftcodePublic>
      </div>
    </UModal>

    <UModal v-model="notice">
      <UiFlex type="col" justify="center" class="p-6">
        <UiText color="primary" weight="bold" align="center" size="xl" class="mb-6">Thông Báo</UiText>

        <div class="mb-6 w-full max-h-[60vh] overflow-y-auto">
          <UiText color="gray" v-html="landing.notice"></UiText>
        </div>

        <UButton @click="start">Chơi Ngay</UButton>
      </UiFlex>
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
const modal = ref(true)
const notice = ref(false)
const landing = ref(undefined)

const tabItem = ref(1) 
const tabItems = [
  { label: 'Đăng Nhập', key: 'in' },
  { label: 'Đăng Ký', key: 'up' },
  { label: 'Giftcode', key: 'giftcode' },
]

const openSign = () => {
  if(!!authStore.isLogin) return start()
  notice.value = false
  modal.value = true
}

const thankyou = async () => {
  if(!!landing.value.notice) return notice.value = true
  start()
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

    // Facebook Ads
    if(landing.value.facebook_ads && !!process.client){
      window.fbq('init', landing.value.facebook_ads);
      window.fbq('track', 'PageView');
    }
  }
  catch (e) {
    return false
  }
}
getLanding()
</script>