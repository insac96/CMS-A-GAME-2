<template>
  <UCard
    :ui="{ 
      base: 'relative transition-all ',
      rounded: 'rounded-xl',
      shadow: 'shadow-md hover:shadow-lg',
      body: { padding: 'px-2 sm:px-2 py-6 sm:py-6' },
      divide: '',
      ring: 'dark:ring-1 ring-0'
    }"
  > 
    <USkeleton class="w-[100px] h-[100px] mx-auto mb-4" />

    <USkeleton class="w-32 h-5 mx-auto mb-2" />
    <USkeleton class="w-24 h-2 mx-auto mb-4" />

    <USkeleton class="w-16 h-7 mx-auto" />
  </UCard>
</template>