<template>
  <div v-if="!!active">
    <UDivider class="mt-4" :label="label || 'Hoặc đăng nhập nhanh'" />

    <UiFlex justify="center" class="pt-5 gap-3">
      <AuthSignSocialFacebook v-if="!!configStore.config.facebook.client_id && !!configStore.config.facebook.client_version" />
      <AuthSignSocialGoogle v-if="!!configStore.config.google.client_id" />
      <AuthSignSocialZalo v-if="!!configStore.config.zalo.client_id" />
      <AuthSignSocialTiktok v-if="!!configStore.config.tiktok.client_id" />
    </UiFlex>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const props = defineProps(['label'])

const active = computed(() => {
  if(
    !configStore.config.facebook.client_id 
    && !configStore.config.facebook.client_version
    && !configStore.config.google.client_id
    && !configStore.config.zalo.client_id
    && !configStore.config.tiktok.client_id
  ) return false
  return true
}) 
</script>

