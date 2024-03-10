<template>
  <UiFlex class="xl:hidden">
    <UiIcon 
      name="i-bx-menu-alt-left"
      size="7"
      aria="Menu"
      pointer
      @click="open = true"
    />

    <USlideover v-model="open" side="left" :ui="{
      width: 'w-screen max-w-xs'
    }">
      <UCard 
        class="flex flex-col flex-1 w-full" 
        :ui="{ 
          base: 'overflow-y-auto',
          body: { base: 'grow overflow-y-auto' },
          ring: '', 
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
      >
        <UiFlex class="w-full mb-6" justify="center">
          <NuxtLink :to="`/preview/${route.params._secret}`">
            <UiLogo @click="open = false" />
          </NuxtLink>
        </UiFlex>

        <LayoutPreviewNav @to="open = false"/>
      </UCard>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const route = useRoute()
const open = ref(false)
</script>