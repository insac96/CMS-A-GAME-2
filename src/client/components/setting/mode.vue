<template>
  <UTabs v-model="selected" :items="tabItems"/>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const mode = useColorMode()
const modeCookie = useCookie('theme-mode', runtimeConfig.public.cookieConfig)

const tabItems = [
  { label: 'Dark', key: 'dark' },
  { label: 'Light', key: 'light' },
  { label: 'Auto', key: 'system' },
]

const selected = computed({
  get () {
    const modeKey = !!modeCookie.value ? modeCookie.value : mode.value
    const index = tabItems.findIndex(i => i.key == modeKey)
    return index === -1 ? 0 : index
  },

  set (value) {
    mode.preference = tabItems[value].key
    modeCookie.value = tabItems[value].key
  }
})
</script>
