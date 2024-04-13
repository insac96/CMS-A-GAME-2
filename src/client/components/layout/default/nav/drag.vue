<template>
  <div class="xl:hidden">
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown :items="menu" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true'
      }">
        <UiImg v-if="!!configStore.config.logo_image" :src="configStore.config.logo_image" w="1" h="1" img-w="100" img-h="100" class="w-full h-full overflow-hidden rounded-full" />
        <UiIcon v-else name="i-bx-menu" color="primary" size="8" />
      </UDropdown>
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 2;" v-if="!!dragging"></div>

    <UModal v-model="modal.payment">
      <UiDialog title="Nạp Xu" @close="modal.payment = false">
        <MainActionPayment />
      </UiDialog>
    </UModal>

    <UModal v-model="modal.giftcode">
      <UiDialog title="Giftcode" @close="modal.giftcode = false">
        <MainActionGiftcode />
      </UiDialog>
    </UModal>

    <UModal v-model="modal.shop" :ui="{width: 'sm:max-w-[850px]'}">
      <UiDialog title="Cửa hàng" @close="modal.shop = false">
        <MainShop />
      </UiDialog>
    </UModal>

    <UModal v-model="modal.event" :ui="{width: 'sm:max-w-[850px]'}">
      <UiDialog title="Sự kiện" @close="modal.event = false">
        <MainEvent />
      </UiDialog>
    </UModal>

    <UModal v-model="modal.wheel">
      <UiDialog title="Vòng quay" @close="modal.wheel = false">
        <MainMinigameWheel />
      </UiDialog>
    </UModal>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const emits = defineEmits(['open'])

const el = ref(null)

const dragging = ref(false)

const modal = ref({
  payment: false,
  giftcode: false,
  shop: false,
  event: false,
  wheel: false
})

const menu = computed(() => {
  const list = [
    [{
      label: 'Trang chủ',
      icon: 'i-bx-home',
      click: () => useTo().navigateToSSL('/')
    }],
    [{
      label: 'Nạp xu',
      icon: 'i-bx-credit-card',
      click: () => modal.value.payment = true
    },{
      label: 'Giftcode',
      icon: 'i-bx-barcode-reader',
      click: () => modal.value.giftcode = true
    }],
    [{
      label: 'Cửa hàng',
      icon: 'i-bx-shopping-bag',
      click: () => modal.value.shop = true
    },{
      label: 'Sự kiện',
      icon: 'i-bx-calendar',
      click: () => modal.value.event = true
    }],
    [{
      label: 'Vòng quay',
      icon: 'i-bxs-color',
      click: () => modal.value.wheel = true
    }],
    [{
      label: 'Fanpage',
      icon: 'i-bxl-facebook',
      click: () => window.open(configStore.config.social.facebook, '_blank')
    },{
      label: 'Zalo',
      icon: 'i-bxs-group',
      click: () => window.open(configStore.config.social.zalo, '_blank')
    }]
  ]

  if(authStore.isLogin){
    if(authStore.profile.type > 0) list.push([{
      label: 'Quản trị viên',
      icon: 'i-bx-server',
      click: () => goToAdmin()
    }])

    list.push([{
      label: 'Đăng xuất',
      icon: 'i-bx-log-out',
      click: () => logout()
    }])
  }

  return list;
})

const { style } = useDraggable(el, {
  initialValue: { x: -8, y: -8 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const logout = async () => {
  await useAPI('auth/sign/out')
  authStore.removeAuth()
  window.location.href = `${runtimeConfig.public.clientURL}`
}

const goToAdmin = () => {
  window.location.href = `${runtimeConfig.public.clientURL}/admin`
}
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 45px
  min-height: 45px
  width: 45px
  height: 45px
  max-width: 45px
  max-height: 45px
  z-index: 3
  cursor: pointer
</style>