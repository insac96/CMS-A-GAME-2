<template>
  <UiFlex class="relative w-full h-full min-h-full max-h-full">
    <iframe 
      v-if="url"
      title="Landing Page"
      :src="url"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>
    <div class="absolute top-0 left-0 w-full h-full cursor-pointer"  @click="start"></div>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore()
const url = ref(null)

const getLanding = async () => {
  const home = await useAPI('config/homepage')
  if(home != '/') return url.value = home
}

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    await useAPI('game/start')
    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
  }
}

getLanding()
</script>