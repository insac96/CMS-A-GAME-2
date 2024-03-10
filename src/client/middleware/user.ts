export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw 'Vui lòng đăng nhập trước'
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})