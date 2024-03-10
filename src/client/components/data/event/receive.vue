<template>
  <UForm :state="state" @submit="submit" v-if="!!event">
    <UFormGroup label="Máy chủ">
      <SelectGameServer v-model="state.server" />
    </UFormGroup>

    <UFormGroup label="Nhân vật" v-if="state.server" >
      <SelectGameRole v-model="state.role" :server="state.server" />
    </UFormGroup>

    <UFormGroup label="Phần thưởng">
      <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
        <DataItemList :items="event.gift" class="justify-center"/>
      </UCard>
    </UFormGroup>

    <UiFlex justify="end" class="mt-4">
      <UButton @click="submit" :loading="loading" class="mr-1" v-if="!!isActive">Nhận</UButton>
      <UButton color="gray" :disabled="loading" @click="emit('close')">Đóng</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const props = defineProps(['event'])
const emit = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  event: props.event ? props.event._id : null,
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/get')
    await useAPI('event/receive', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>