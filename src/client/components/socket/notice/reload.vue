<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'max-w-[300px]'}">
    <UiFlex type="col" justify="center" class="p-6">
      <UiIcon name="i-bxs-cloud-download" size="24" color="primary" />
      <UiText color="primary" weight="bold" align="center" size="xl" class="mb-2">Update Now</UiText>
      <UiText color="gray" align="center" class="mb-4">{{ notice }}</UiText>
      <UButton @click="reload">Xác Nhận</UButton>
    </UiFlex>
  </UModal>
</template>

<script setup>
const { $socket } = useNuxtApp()

const modal = ref(false)
const notice = ref(null)

const reload = () => {
  useTo().navigateToSSL('/')
  location.reload()
}

onMounted(() => {
  $socket.on('notice-reload', (data) => {
    notice.value = data
    modal.value = true
  })
})
</script>