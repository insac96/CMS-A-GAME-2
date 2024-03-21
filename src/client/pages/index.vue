<template>
  <UiFlex class="relative w-full h-full min-h-full max-h-full">
    <iframe 
      v-if="landing"
      title="Landing Page"
      :src="landing.link"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <div class="absolute top-0 left-0 w-full h-full cursor-pointer"  @click="start"></div>

    <UModal v-model="notice">
      <UiFlex type="col" justify="center" class="p-6">
        <UiText color="primary" weight="bold" align="center" size="xl" class="mb-6">Thông Báo</UiText>

        <div class="mb-6 w-full max-h-[60vh] overflow-y-auto">
          <UiText color="gray" v-html="landing ? landing.notice : 'Trò chơi đang bảo trì'"></UiText>
        </div>
      </UiFlex>
    </UModal>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const landing = ref(null)
const notice = ref(false)

const getLanding = async () => {
  const home = await useAPI('config/homepage')
  if(home != '/') return landing.value = home
}

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    // Check Game Play
    if(!configStore.config.enable.play && authStore.profile.type < 1){
      if(landing.value) return notice.value = true
    }

    

    // Game Start
    await useAPI('game/start')
    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
  }
}

getLanding()
</script>