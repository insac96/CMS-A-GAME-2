<template>
  <div>
    <UCard>
      <DataUserMini mini-num no-level :reload="reload" class="mb-4" v-if="!!authStore.isLogin"/>

      <DataMinigameWheelBox 
        :items="items" 
        :gift-id="gift" 
        :spin="spin" 
        @done="doneSpin" 
        class="mb-6"
      />

      <UForm :state="state" :validate="validate" @submit="spinWheel" v-if="!!authStore.isLogin">
        <UFormGroup label="Máy chủ" name="server">
          <SelectGameServer v-model="state.server" />
        </UFormGroup>
        
        <UFormGroup label="Nhân vật" name="role" v-if="state.server">
          <SelectGameRole v-model="state.role" :server="state.server" />
        </UFormGroup>
        
        <UiFlex>
          <UButton color="gray" class="mr-auto" @click="modal.limit = true" v-if="!!authStore.isLogin && !!history">Lịch Sử</UButton>
          <USelectMenu  v-model="state.times" :options="[1, 5, 10]" class="mx-1">
            <template #label>x {{ state.times }}</template>
            <template #option="{ option }">x {{ option }}</template>
          </USelectMenu>
          <UButton type="submit" :loading="loading">{{ loading ? '' : 'Quay' }}</UButton>
        </UiFlex>
      </UForm>
    </UCard>

    <UModal v-model="modal.limit">
      <DataMinigameWheelHistory />
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !!val && getWheel())

const props = defineProps({
  history: { type: Boolean, default: true }
})

const modal = ref({
  limit: false
})

const state = ref({
  server: null,
  role: null,
  times: 1
})

const loading = ref(false)
const reload = ref(0)
const spin = ref(0)
const items = ref([])
const gift = ref(null)

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const doneSpin = () => {
  loading.value = false
  reload.value++
  getWheel()
}

const spinWheel = async () => {
  try {
    loading.value = true
    const data = await useAPI('minigame/wheel/spin', JSON.parse(JSON.stringify(state.value)))

    gift.value = data
    spin.value++
  }
  catch {
    loading.value = false
  }
}

const getWheel = async () => {
  const data = await useAPI('minigame/wheel/get')
  items.value = data
}

getWheel()
</script>