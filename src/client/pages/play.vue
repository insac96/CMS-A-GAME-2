<template>
  <iframe 
    title="Playing Game"
    :src="playCookie"
    width="100%"
    height="100%"
    class="Iframe"
  ></iframe>
  
  <UModal v-model="fastShop.modal" prevent-close>
    <DataShopBuyItem :item="fastShop.item" :server="fastShop.server" @close="fastShop.modal = false" @done="onDoneBuy" class="p-4" />
  </UModal>

  <UModal v-model="fastGiftcode.modal" prevent-close>
    <DataGiftcodeReceive :giftcode="fastGiftcode.giftcode" :server="fastGiftcode.server" @close="fastGiftcode.modal = false" @done="onDoneCode" class="p-4" />
  </UModal>
</template>

<script setup>
definePageMeta({
  middleware: 'play'
})

const runtimeConfig = useRuntimeConfig()
const playCookie = useCookie('play-url', runtimeConfig.public.cookieConfig)

// Recharge Game
const fastShop = ref({
  modal: false,
  item: null,
  server: null
})

const onFastShop = async (detail) => {
  try {
    const data = await useAPI('shop/getFast', JSON.parse(JSON.stringify(detail)))
    fastShop.value.item = data.item
    fastShop.value.server = data.server
    fastShop.value.modal = true
  }
  catch (e) {
    return
  }
}

const onDoneBuy = async (data) => {
  const iframe = document.querySelector("iframe")
  iframe.contentWindow.postMessage(JSON.stringify(data), "*")
}

// Giftcode Game
const fastGiftcode = ref({
  modal: false,
  giftcode: null,
  server: null
})

const onFastGiftcode = async (detail) => {
  try {
    const data = await useAPI('giftcode/getFast', JSON.parse(JSON.stringify(detail)))
    fastGiftcode.value.giftcode = data.giftcode
    fastGiftcode.value.server = data.server
    fastGiftcode.value.modal = true
  }
  catch (e) {
    return
  }
}

const onDoneCode = async () => {
  fastGiftcode.value = {
    modal: false,
    giftcode: null,
    server: null
  }
}

// On Fast
const onFast = (e) => {
  const detail = e.data
  if(!detail) return
  
  if(detail.code) return onFastGiftcode(detail)
  if(detail.item_id) return onFastShop(detail)
}

onMounted(() => {
  window.addEventListener('message', onFast, false)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('message', onFast, false)
})
</script>