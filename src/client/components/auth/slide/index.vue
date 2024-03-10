<template>
  <UiFlex>
    <UButton
      class="relative p-1.5"
      icon="i-bxs-user"
      color="gray" 
      variant="ghost" 
      aria-label="User"
      @click="open = true"
    >
      <UiDot v-if="authStore.profile.notify > 0" class="absolute top-0 right-0" />
    </UButton>

    <USlideover v-model="open" :ui="{ width: 'w-screen md:max-w-sm max-w-xs'}">
      <UCard 
        class="flex flex-col flex-1" 
        :ui="{ 
          body: { base: 'flex grow overflow-hidden', padding: 'px-0 py-0 sm:p-0' },
          header: { padding: '' },
          ring: '', 
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
      >
        <template #header>
          <AuthSlideUser @close="open = false" />
        </template>

        <AuthSlideNotify @close="open = false" />
      </UCard>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const open = ref(false)
</script>