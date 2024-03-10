<template>
  <header class="sticky top-0 z-50 bg-white/75 dark:bg-transparent backdrop-blur-xl">
    <UContainer class="flex items-center h-[var(--header-size)] max-h-[var(--header-size)]">
      <LayoutDefaultNavSlide class="mr-2"/>
      
      <UiFlex class="mr-auto">
        <NuxtLink to="/">
          <UiLogo />
        </NuxtLink>
      </UiFlex>
      
      <UiFlex justify="end" items="center">
        <Setting />
        <SocketChat class="ml-1" />
        <AuthSign v-if="!authStore.isLogin" class="ml-1" />
        <LazyAuthSlide v-else class="ml-1" />
      </UiFlex>
    </UContainer>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>