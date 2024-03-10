<template>
  <UiFlex class="PannelMenu" @click="to">
    <UiFlex type="col" items="start" class="pl-5">
      <UiText class="PannelMenu__Title mb-1" size="3xl">Payment</UiText>
      <UiText size="xs">Nạp Xu</UiText>
    </UiFlex>
    <img class="PannelMenu__Icon" src="/ui/pay.png" />

    <UModal v-model="modal">
      <UiDialog title="Nạp Xu" @close="modal = false">
        <MainActionPayment />
      </UiDialog>
    </UModal>
  </UiFlex>
</template>

<script setup>
const modal = ref(false)
const authStore = useAuthStore()

const to = () => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value = true
}
</script>