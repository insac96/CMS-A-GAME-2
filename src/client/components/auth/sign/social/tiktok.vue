<template>
  <UiImg 
    class="max-w-[45px] max-h-[45px] cursor-pointer rounded-full"
    src="/images/social/tiktok.png"
    w="1" h="1"
    imgW="90" imgH="90"
    alt="FB"
    @click="submit"
  ></UiImg>
</template>

<script setup>
const { link } = useMakeLink()
const toast = useToast()
const configStore = useConfigStore()

const submit = async () => {
  try {
    if(!configStore.config.tiktok.client_id) throw 'Tính năng đang bảo trì'
    
    const csrfState = Math.random().toString(36).substring(2)
    let url = 'https://www.tiktok.com/v2/auth/authorize/'
    url += `?client_key=${configStore.config.tiktok.client_id}`
    url += '&scope=user.info.basic'
    url += '&response_type=code'
    url += `&redirect_uri=${link('/callback/sign/tiktok/')}`
    url += '&state=' + csrfState
    window.location.replace(url)
  }
  catch (e) {
    toast.add({
      color: 'red',
      title: 'Thông báo',
      description: e.toString(),
      icon: 'i-bxs-lock',
      timeout: 2000
    })
  }
}
</script>