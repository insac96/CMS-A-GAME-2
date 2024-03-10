<template>
  <UiFlex justify="center" type="col" v-if="user">
    <UiFlex class="mb-2">
      <UiText size="sm" class="mr-1" color="gray">Xin chào, </UiText>
      <UiText size="sm" class="uppercase" weight="semibold">{{ user.username }}</UiText>
    </UiFlex>

    <UButtonGroup size="sm" orientation="horizontal">
      <UButton color="primary" icon="i-bxs-dollar-circle"></UButton>
      <UButton :label="toMoney(user?.currency?.coin)" color="gray"/>
    </UButtonGroup>
  </UiFlex>
</template>

<script setup>
const { toMoney } = useMoney()

const loading = ref(false)

const user = ref({
  username: 0,
  currency: {
    coin: 0
  }
})

const auth = useAuthStore()

const getUserBox = async () => {
  try {
    loading.value = true
    const get = await useAPI('user/getBox', {
      _id: auth.profile?._id
    })

    user.value = get
    setTimeout(() => loading.value = false, 500)
  }
  catch(e) {
    loading.value = false
  }
}

getUserBox()
</script>