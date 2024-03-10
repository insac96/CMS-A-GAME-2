<template>
  <UiFlex type="col" justify="center" class="p-6 w-full min-h-screen">
    <UiText color="primary" weight="bold" align="center" style="font-size: 8rem">
      {{ error.statusCode }}
    </UiText>
    <UiText color="gray" size="2xl" align="center" class="mb-6">
      {{ error.message || error.statusMessage || 'Có lỗi xảy ra' }}
    </UiText>
    <UButton size="md" @click="useTo().navigateToSSL('/')">Trang Chủ</UButton>
  </UiFlex>
</template>

<script setup>
const { imgLink } = useMakeLink()
const configStore = useConfigStore()

const props = defineProps({
  error: Object
})

useSeoMeta({
  title: `${props.error.statusCode} - ${configStore.config.name}`,
  description: props.error.message || props.error.statusMessage,
  ogDescription: props.error.message || props.error.statusMessage,
  ogImage: imgLink(configStore.config.og_image),
  ogImageAlt: props.error.statusCode,
  ogImageType: 'image/png',
  ogType: 'website',
})
</script>