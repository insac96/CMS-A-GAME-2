<template>
  <UiFlex justify="center" wrap="wrap">
    <UButton
      v-for="color in primaryColors" :key="color.value"
      color="white"
      square
      :variant="color.value === primary.value ? 'solid' : 'ghost'"
      @click="primary = color"
    >
      <UiDot size="5" :style="`color: ${color.hex}`" />
    </UButton>
  </UiFlex>

  <hr class="border-gray-200 dark:border-gray-800 my-2">

  <UiFlex justify="center" wrap="wrap">
    <UButton
      v-for="color in grayColors" :key="color.value"
      color="white"
      square
      :variant="color.value === gray.value ? 'solid' : 'ghost'"
      @click="gray = color"
    >
      <UiDot size="5" :style="`color: ${color.hex}`" />
    </UButton>
  </UiFlex>
</template>

<script setup>
import colors from '#tailwind-config/theme/colors'
const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
const colorMode = useColorMode()

const primaryCookie = useCookie('theme-primary', runtimeConfig.public.cookieConfig)
const primaryColors = computed(() => {
  return appConfig.ui.colors.filter(color => color !== 'primary').map(color => ({ 
    value: color, 
    hex: colors[color][colorMode.value === 'dark' ? 400 : 500] 
  }))
})
const primary = computed({
  get () {
    return primaryColors.value.find(option => option.value === appConfig.ui.primary)
  },
  set (option) {
    appConfig.ui.primary = option.value
    primaryCookie.value = option.value
  }
})

const grayCookie = useCookie('theme-gray', runtimeConfig.public.cookieConfig)
const grayColors = computed(() => {
  return ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(color => ({ 
    value: color, 
    hex: colors[color][colorMode.value === 'dark' ? 400 : 500] 
  }))
})
const gray = computed({
  get () {
    return grayColors.value.find(option => option.value === appConfig.ui.gray)
  },
  set (option) {
    appConfig.ui.gray = option.value
    grayCookie.value = option.value
  }
})
</script>