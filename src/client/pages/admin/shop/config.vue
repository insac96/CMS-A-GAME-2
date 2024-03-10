<template>
  <UiContent title="Config Shop" sub="Cài đặt cửa hàng" class="max-w-3xl mx-auto">
      <UForm :state="state" @submit="update">
        <UFormGroup label="Giảm giá">
          <UInput v-model="state.discount.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời hạn">
          <SelectDate v-model="state.discount.expired" time />
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
  discount: {
    number: null,
    expired: null
  }
})

const getConfig = async () => {
  const config = await useAPI('shop/admin/config/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true
    await useAPI('shop/admin/config/update', JSON.parse(JSON.stringify(state.value)))

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>