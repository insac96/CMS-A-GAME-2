<template>
  <UiFlex class="PannelMenu" @click="to">
    <UiFlex type="col" items="start" class="pl-5">
      <UiText class="PannelMenu__Title mb-1" size="3xl">Rank</UiText>
      <UiText size="xs">Xếp Hạng</UiText>
    </UiFlex>
    <img class="PannelMenu__Icon" src="/ui/wheel.png" />

    <UModal v-model="modal">
      <UiDialog title="Xếp Hạng" @close="modal = false">
        <MainMinigameWheel />
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