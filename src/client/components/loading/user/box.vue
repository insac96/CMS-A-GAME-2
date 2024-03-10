<template>
  <div>
    <UiFlex class="p-5">
      <USkeleton class="h-10 w-10 mr-4" :ui="{ rounded: 'rounded-full' }" />

      <div>
        <USkeleton class="h-4 w-40 mb-2" />
        <UiFlex class="w-full">
          <USkeleton class="h-5 w-12 mr-1" />
          <USkeleton class="h-5 w-12" />
        </UiFlex>
      </div>
    </UiFlex>

    <UiFlex
      v-if="!noCurrency && (!!authStore.isLogin && authStore.profile.type > 0)"
      :class="[
        'divide-x divide-gray-100 dark:divide-gray-800',
        'border-t border-gray-100 dark:border-gray-800',
      ]"
    >
      <UiFlex type="col" class="w-4/12 py-4">
        <USkeleton class="h-2 w-8 mb-1" />
        <USkeleton class="h-4 w-12" />
      </UiFlex>

      <UiFlex type="col" class="w-4/12 py-4">
        <USkeleton class="h-2 w-8 mb-1" />
        <USkeleton class="h-4 w-12" />
      </UiFlex>

      <UiFlex type="col" class="w-4/12 py-4">
        <USkeleton class="h-2 w-8 mb-1" />
        <USkeleton class="h-4 w-12" />
      </UiFlex>
    </UiFlex>

    <div 
      v-if="!noAuth && (!!authStore.isLogin && authStore.profile.type > 0)"
      :class="[
        'py-2 px-4',
        'border-t border-gray-100 dark:border-gray-800',
      ]"
    >
      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
        <USkeleton class="h-4 w-4 mr-4" :ui="{ rounded: 'rounded-full' }" />
        <USkeleton class="h-4 w-36" />
      </UiFlex>

      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
        <USkeleton class="h-4 w-4 mr-4" :ui="{ rounded: 'rounded-full' }" />
        <USkeleton class="h-4 w-24" />
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
defineProps({
  noAuth: Boolean,
  noCurrency: Boolean
})

const authStore = useAuthStore()
</script>