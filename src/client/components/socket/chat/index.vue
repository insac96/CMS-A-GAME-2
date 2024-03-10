<template>
  <UiFlex>
    <UButton
      class="relative p-1.5"
      icon="i-bxs-chat"
      color="gray" 
      variant="ghost" 
      aria-label="Chat"
      @click="open = true"
    >
    </UButton>

    <USlideover v-model="open" :ui="{ width: 'w-screen md:max-w-sm max-w-xs'}">
      <UCard 
        class="flex flex-col flex-1 max-h-full" 
        :ui="{ 
          body: { base: 'flex grow overflow-hidden', padding: '' },
          header: { padding: '' },
          footer: { padding: '' },
          ring: '', 
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
      >
        <template #header>
          <SocketOnline @close="open = false" />
        </template>

        <SocketChatList />

        <template #footer>
          <SocketChatSend />
        </template>
      </UCard>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>