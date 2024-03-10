<template>
  <UiContent 
    title="Action" 
    sub="Chức năng thời gian thực" 
    class="max-w-3xl mx-auto"
  >
    <UAlert icon="i-bx-chat" title="Xóa kênh Chat" :ui="{ title: 'text-primary font-bold'}" class="mb-4">
      <template #description>
        <UiText size="sm">Xóa toàn bộ tất cả các tin nhắn trên hệ thống</UiText>
        <UiFlex justify="end">
          <UButton color="gray" :loading="loading.delAllChat" @click="delAllChat">Chạy</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert icon="i-bx-revision" title="Cập nhật" :ui="{ title: 'text-primary font-bold'}" class="mb-4">
      <template #description>
        <UiText size="sm" class="mb-2">Ép tất cả máy khách tải lại trang</UiText>
        <UiFlex justify="end">
          <UInput v-model="noticeReload" class="mr-1" size="sm" placeholder="Nội dung thông báo" />
          <UButton color="gray" :loading="loading.noticeReload" @click="sendNoticeReload">Chạy</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert icon="i-bxs-megaphone" title="Thông báo" :ui="{ title: 'text-primary font-bold'}">
      <template #description>
        <UiText size="sm" class="mb-4">Gửi thông báo đến tất cả người trực tuyến</UiText>

        <UiEditor v-model="noticeSystem" class="mb-2" />

        <UiFlex justify="end">
          <UButton color="gray" :loading="loading.noticeSystem" @click="sendNoticeSystem">Gửi</UButton>
        </UiFlex>
      </template>
    </UAlert>
  </UiContent>
</template>

<script setup>
const loading = ref({
  delAllChat: false,
  noticeReload: false,
  noticeSystem: false
})

const noticeReload = ref('Có bản cập nhật mới, vui lòng tải lại trang !')
const noticeSystem = ref(null)

const delAllChat = async () => {
  try {
    loading.value.delAllChat = true
    await useAPI('socket/admin/action/delAllChat')

    loading.value.delAllChat = false
  }
  catch (e) {
    loading.value.delAllChat = false
  }
}

const sendNoticeReload = async () => {
  try {
    loading.value.noticeReload = true
    await useAPI('socket/admin/action/noticeReload', {
      notice: noticeReload.value
    })

    loading.value.noticeReload = false
  }
  catch (e) {
    loading.value.noticeReload = false
  }
}

const sendNoticeSystem = async () => {
  try {
    loading.value.noticeSystem = true
    await useAPI('socket/admin/action/noticeSystem', {
      notice: noticeSystem.value
    })

    loading.value.noticeSystem = false
  }
  catch (e) {
    loading.value.noticeSystem = false
  }
}
</script>