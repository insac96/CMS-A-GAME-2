<template>
  <UiContent title="Action User" sub="Chức năng tài khoản" class="max-w-3xl mx-auto">
    <UCard class="mb-4">
      <template #header>
        <UiText color="primary" weight="semibold">Tích Nạp</UiText>
      </template>

      <UiFlex justify="between" class="mb-2">
        <UiText color="gray" size="sm">Reset tích nạp ngày</UiText>
        <UButton color="gray" @click="action('pay.day')">Thực hiện</UButton>
      </UiFlex>

      <UiFlex justify="between" class="mb-2">
        <UiText color="gray" size="sm">Reset tích nạp tháng</UiText>
        <UButton color="gray" @click="action('pay.month')">Thực hiện</UButton>
      </UiFlex>

      <UiFlex justify="between">
        <UiText color="gray" size="sm">Reset tích nạp tổng</UiText>
        <UButton color="gray" @click="action('pay.total')">Thực hiện</UButton>
      </UiFlex>
    </UCard>

    <UCard>
      <template #header>
        <UiText color="primary" weight="semibold">Tiêu Phí</UiText>
      </template>

      <UiFlex justify="between" class="mb-2">
        <UiText color="gray" size="sm">Reset tiêu phí ngày</UiText>
        <UButton color="gray" @click="action('spend.day')">Thực hiện</UButton>
      </UiFlex>

      <UiFlex justify="between" class="mb-2">
        <UiText color="gray" size="sm">Reset tiêu phí tháng</UiText>
        <UButton color="gray" @click="action('spend.month')">Thực hiện</UButton>
      </UiFlex>

      <UiFlex justify="between">
        <UiText color="gray" size="sm">Reset tiêu phí tổng</UiText>
        <UButton color="gray" @click="action('spend.total')">Thực hiện</UButton>
      </UiFlex>
    </UCard>
  </UiContent>
</template>

<script setup>
const loading = ref(false)
const { error } = useNotify()

const action = async (type) => {
  try {
    if(!!loading.value) return error('Có 1 tiến trình đang xử lý, vui lòng đợi')
    
    loading.value = true
    await useAPI('user/admin/action', {
      type: type
    })

    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>