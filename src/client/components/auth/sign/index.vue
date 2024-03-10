<template>
  <UModal v-model="modal">
    <UiDialog title="Xác Thực"  @close="modal = false">
      <LazyAuthSignIn v-if="tabItem == 0" @done="modal = false" @up="tabItem = 1"></LazyAuthSignIn>
      <LazyAuthSignUp v-if="tabItem == 1" @done="modal = false" @in="tabItem = 0"></LazyAuthSignUp>
      <!-- <LazyAuthSignForgot v-if="tabItem == 2" @done="modal = false"></LazyAuthSignForgot> -->
    </UiDialog>
  </UModal>
</template>

<script setup>
const authStore = useAuthStore()
const modal = ref(false)
const tabItem = ref(0) 
const tabItems = [
  { label: 'Đăng nhập', key: 'in' },
  { label: 'Đăng ký', key: 'up' },
  { label: 'Mật khẩu', key: 'fotgot' },
]

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setModal(false))
</script>