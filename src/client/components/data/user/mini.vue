<template>
  <div>
    <USkeleton class="w-full h-8" v-if="!!loading && !user"/>
    
    <UiFlex v-else>
      <UButtonGroup size="sm" orientation="horizontal" v-if="!noLevel">
        <UButton color="gray" class="rounded-l-full px-2">
          <UAvatar :src="user.avatar" alt="Avatar" size="2xs"/>
        </UButton>
        <UButton color="white">Cấp {{ user.level?.number || 0 }}</UButton>
      </UButtonGroup>

      <div class="ml-auto">
        <UButtonGroup size="sm" orientation="horizontal" class="ml-2" v-if="!noCoin">
          <UButton :label="miniNum ? miniMoney(user.currency?.coin) : toMoney(user.currency?.coin)" color="gray" @click="navigateToSSL('/main/action/payment')" />
          <UButton  color="primary" icon="i-bxs-dollar-circle" @click="navigateToSSL('/main/action/payment')"></UButton>
        </UButtonGroup>

        <UButtonGroup size="sm" orientation="horizontal" class="ml-2" v-if="!noWheel">
          <UButton :label="miniNum ? miniMoney(user.currency?.wheel) : toMoney(user.currency?.wheel)" color="gray" @click="navigateToSSL('/main/minigame/wheel')" />
          <UButton  color="primary" icon="i-bxs-color" @click="navigateToSSL('/main/minigame/wheel')"></UButton>
        </UButtonGroup>

        <UButtonGroup size="sm" orientation="horizontal" class="ml-2" v-if="!noNotify">
          <UButton :label="miniNum ? miniMoney(user.currency?.notify) : toMoney(user.currency?.notify)" color="gray" />
          <UButton  color="primary" icon="i-bxs-megaphone"></UButton>
        </UButtonGroup>

        <UButtonGroup size="sm" orientation="horizontal" class="ml-2" v-if="!noDiamond">
          <UButton :label="miniNum ? miniMoney(user.currency?.diamond) : toMoney(user.currency?.diamond)" color="gray" @click="navigateToSSL('/main/action/withdraw')" />
          <UButton  color="primary" icon="i-bxs-diamond" @click="navigateToSSL('/main/action/withdraw')"></UButton>
        </UButtonGroup>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const { miniMoney, toMoney } = useMoney()
const { navigateToSSL } = useTo()
const authStore = useAuthStore()

const props = defineProps({
  reload: Number,
  noLevel: Boolean,
  noCoin: Boolean,
  noWheel: Boolean,
  noNotify: Boolean,
  noDiamond: Boolean,
  miniNum: Boolean,
  modelValue: Object,
  level: Object,
  currency: Object
})
const emit = defineEmits(['update:modelValue', 'update:level', 'update:currency'])

const loading = ref(false)

const user = ref(undefined)

watch(() => props.reload, () => getUserMini())
watch(() => authStore.isLogin, () => getUserMini())

const getUserMini = async () => {
  try {
    if(!authStore.isLogin) return

    loading.value = true
    const get = await useAPI('user/getMini')

    user.value = get
    loading.value = false
    emit('update:modelValue', get)
    emit('update:level', get.level)
    emit('update:currency', get.currency)
  }
  catch(e) {
    loading.value = false
  }
}

getUserMini()
</script>