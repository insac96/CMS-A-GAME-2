export default defineNuxtRouteMiddleware(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    const configStore = useConfigStore()
    if(!authStore.isLogin) throw true

    // @ts-expect-error
    if(authStore.profile.type < 1 && !configStore.config.enable.play) throw true

    const playUrl = useCookie('play-url', runtimeConfig.public.cookieConfig)
    if(!playUrl.value) throw true
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})