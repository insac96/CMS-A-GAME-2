<template>
  <UForm :state="state" @submit="submit" v-if="!!giftcode">
    <UFormGroup label="Máy chủ">
      <SelectGameServer v-model="state.server" />
    </UFormGroup>

    <UFormGroup label="Nhân vật" v-if="state.server" >
      <SelectGameRole v-model="state.role" :server="state.server" />
    </UFormGroup>

    <UFormGroup label="Tên mã">
      <UInput :model-value="giftcode.code" readonly />
    </UFormGroup>

    <UFormGroup label="Giới hạn">
      <UInput :model-value="giftcode.limit == 0 ? 'Không giới hạn' : `${giftcode.limit} người`" readonly />
    </UFormGroup>

    <UFormGroup label="Phần thưởng">
      <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
        <DataItemList :items="giftcode.gift" class="justify-center"/>
      </UCard>
    </UFormGroup>

    <UiFlex justify="end" class="mt-4">
      <UButton @click="submit" :loading="loading" class="mr-1" v-if="!!isActive">Nhận</UButton>
      <UButton color="gray" :disabled="loading" @click="emit('close')">Đóng</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const props = defineProps(['giftcode', 'server'])
const emit = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: props.server || null,
  role: null,
  giftcode: props.giftcode ? props.giftcode._id : null,
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('giftcode/receive', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>