<template>
  <div>
    <DataEmpty text="Vui lòng đăng nhập trước" icon="i-bx-barcode-reader" v-if="!authStore.isLogin" />

    <div v-else>
      <UForm :validate="validate" :state="state" @submit="submit">
        <UFormGroup name="code">
          <UInput v-model="state.code" placeholder="Nhập mã giftcode" />
        </UFormGroup>

        <UiFlex justify="end">
          <!-- <UButton color="gray" @click="modal.history = true">Lịch sử</UButton> -->
          <UButton type="submit" :loading="loading">Xác Nhận</UButton>
        </UiFlex>
      </UForm>

      <UModal v-model="modal.receive" prevent-close>
        <DataGiftcodeReceive :giftcode="giftcode" @done="doneReceive" @close="modal.receive = false" class="p-4" />
      </UModal>

      <UModal v-model="modal.history">
        <DataGiftcodeHistory/>
      </UModal>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const loading = ref(false)

const modal = ref({
  receive: false,
  history: false
})

const giftcodes = ref(undefined)
const giftcode = ref(undefined)

const state = ref({
  code: null
})

watch(() => modal.value.receive, (val) => !val && (giftcode.value = undefined))

const doneReceive = () => {
  modal.value.receive = false
  state.value.code = null
}

const validate = (state) => {
  const errors = []
  if(!state.code) errors.push({ path: 'code', message: 'Vui lòng điền đầy đủ thông tin' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    const post = JSON.parse(JSON.stringify(state.value))
    const data = await useAPI('giftcode/get', {
      code: post.code
    })

    giftcode.value = data
    loading.value = false
    modal.value.receive = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>