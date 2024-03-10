<template>
  <UiFlex class="PannelMenu" @click="to">
    <UiFlex type="col" items="start" class="pl-5">
      <UiText class="PannelMenu__Title mb-1" items="start" size="3xl">Web Shop</UiText>
      <UiText size="xs">Cửa Hàng</UiText>
    </UiFlex>
    <img class="PannelMenu__Icon" src="/ui/shop.png" />

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[850px]'}">
      <UiDialog title="Cửa Hàng" @close="modal = false">
        <MainShop />
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