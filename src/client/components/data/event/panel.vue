<template>
  <UiFlex class="PannelMenu" @click="to">
    <UiFlex type="col" items="start" class="pl-5">
      <UiText class="PannelMenu__Title mb-1" size="3xl">Web Event</UiText>
      <UiText size="xs">Sự Kiện</UiText>
    </UiFlex>
    <img class="PannelMenu__Icon" src="/ui/event.png" />

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[850px]'}">
      <UiDialog title="Sự Kiện" @close="modal = false">
        <MainEvent/>
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