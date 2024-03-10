
<template>
  <LoadingUserBox v-if="!!loading" :no-auth="noAuth" />

  <DataEmpty v-if="!user && !loading" icon="i-bxs-user-detail"/>

  <div v-if="!!user && !loading">
    <!-- Info -->
    <UiFlex class="p-4">
      <UiFlex @click="useTo().navigateToSSL('/main/user'), emit('action')">
        <UAvatar :src="user.avatar" alt="Avatar" size="md" class="cursor-pointer"  />
      </UiFlex>

      <UiFlex items="start" type="col" class="mx-4 grow">
        <UiText 
          class="mb-1 capitalize"
          weight="semibold"
          @click="startCopy(user.username)"
          pointer
        >{{ user.username }}</UiText>
        
        <UiFlex>
          <UBadge color="primary" variant="soft" class="mr-1">
            Cấp {{ user.level?.number || 0 }}
          </UBadge>
          <UBadge :color="typeFormat[user.type].color" variant="soft" class="cursor-pointer" @click="goToAdmin(user.type)">
            {{ typeFormat[user.type].label }}
          </UBadge>
        </UiFlex>
      </UiFlex>

      <slot name="more"></slot>
    </UiFlex>

    <!--Currency-->
    <UiFlex
      v-if="user.currency"
      :class="[
        'divide-x divide-gray-100 dark:divide-gray-800',
        'border-t border-gray-100 dark:border-gray-800',
      ]"
    >
      <UiFlex type="col" class="p-2 w-4/12">
        <UiText size="xs" color="gray" class="mb-1">Xu Web</UiText>
        <UiText weight="bold" @click="useTo().navigateToSSL('/main/action/payment'), emit('action')" pointer>{{ miniMoney(user.currency?.coin) }}</UiText>
      </UiFlex>

      <UiFlex type="col" class="p-2 w-4/12">
        <UiText size="xs" color="gray" class="mb-1">Cống Hiến</UiText>
        <UiText weight="bold" @click="useTo().navigateToSSL('/main/action/withdraw'), emit('action')" pointer>{{ miniMoney(user.currency?.diamond) }}</UiText>
      </UiFlex>

      <UiFlex type="col" class="p-2 w-4/12">
        <UiText size="xs" color="gray" class="mb-1">Lượt Quay</UiText>
        <UiText weight="bold" @click="useTo().navigateToSSL('/main/minigame/wheel'), emit('action')" pointer>{{ miniMoney(user.currency?.wheel) }}</UiText>
      </UiFlex>
    </UiFlex>

    <!--Email Phone-->
    <div 
      v-if="(user.phone || user.email || user.referral) && !noAuth"
      :class="[
        'py-2 px-4',
        'border-t border-gray-100 dark:border-gray-800',
      ]"
    >
      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2" v-if="user.referral">
        <UiFlex class="mr-6" >
          <UiIcon name="i-bx-barcode" size="5" class="mr-2" />
          <UiText weight="semibold" size="sm">Mã mời</UiText>
        </UiFlex>
        
        <UiText size="sm" weight="bold" color="primary" pointer @click="startCopy(user.referral.code)">{{ user.referral.code || '...' }}</UiText>
      </UiFlex>

      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
        <UiFlex class="mr-6" >
          <UiIcon name="i-bx-envelope" size="5" class="mr-2" />
          <UiText weight="semibold" size="sm">Hòm thư</UiText>
        </UiFlex>

        <UiText size="sm" weight="bold" color="primary" pointer @click="startCopy(user.email)">{{ user.email || '...' }}</UiText>
      </UiFlex>

      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
        <UiFlex class="mr-6" >
          <UiIcon name="i-bx-phone" size="5" class="mr-2" />
          <UiText weight="semibold" size="sm">Điện thoại</UiText>
        </UiFlex>

        <UiText size="sm" weight="bold" color="primary" pointer @click="startCopy(user.phone)">{{ user.phone || '...' }}</UiText>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const { copy, isSupported } = useClipboard()
const { miniMoney } = useMoney()
const emit = defineEmits(['action', 'update:userData'])

const props = defineProps({
  profile: Object,
  fetchId: String,
  noAuth: Boolean,
  reload: Number,
  userData: Object
})

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const loading = ref(false)
const user = ref(undefined)

watch(() => props.reload, (val) => !!val && init())

const startCopy = (text) => {
  if(!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}

const goToAdmin = (type) => {
  if(type < 1) return
  window.location.href = `${runtimeConfig.public.clientURL}/admin`
}

const getUserBox = async () => {
  try {
    loading.value = true
    const get = await useAPI('user/getBox', {
      _id: props.fetchId,
      secret: route.params._secret
    })

    user.value = get
    emit('update:userData', get)
    setTimeout(() => loading.value = false, 500)
  }
  catch(e) {
    loading.value = false
  }
}

const init = () => {
  if(!!props.fetchId) return getUserBox()
  user.value = props.profile ? props.profile : undefined
}

init()
</script>