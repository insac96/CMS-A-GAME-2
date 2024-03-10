<template>
  <UiContent title="Config Payment" sub="Cài đặt nạp tiền" class="max-w-3xl mx-auto">
      <UForm :state="state" @submit="update">
        <UFormGroup label="Khuyến mại tích nạp">
          <UInput v-model="state.pay.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời hạn">
          <SelectDate v-model="state.pay.expired" time />
        </UFormGroup>

        <UiFlex>
          <UToggle v-model="state.maintenance" :disabled="!!updating" />
          <UiText size="sm" class="ml-2 mr-auto">Bảo trì</UiText>

          <UButton type="submit" color="gray" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </UForm>
  </UiContent>
</template>

<script setup>
const load = ref(true)
const updating = ref(false)

const state = ref({
  maintenance: null,
  pay: {
    number: null,
    expired: null
  }
})

const getConfig = async () => {
  const config = await useAPI('payment/admin/config/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true
    await useAPI('payment/admin/config/update', JSON.parse(JSON.stringify(state.value)))

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>