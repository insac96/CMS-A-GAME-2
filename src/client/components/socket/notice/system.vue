<template>
  <UModal v-model="modal" prevent-close>
    <UiFlex type="col" justify="center" class="p-6">
      <UiText color="primary" weight="bold" align="center" size="xl" class="mb-6">Thông Báo</UiText>

      <div class="mb-6 w-full max-h-[60vh] overflow-y-auto">
        <UiText color="gray" v-html="notice"></UiText>
      </div>

      <UButton @click="modal = false">Xác Nhận</UButton>
    </UiFlex>
  </UModal>
</template>

<script setup>
const { $socket } = useNuxtApp()

const modal = ref(false)
const notice = ref(null)

onMounted(() => {
  $socket.on('notice-system', (data) => {
    notice.value = data
    modal.value = true
  })
})
</script>