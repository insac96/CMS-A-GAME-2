<template>
  <UContainer :ui="{ padding: 'p-0 sm:p-0 lg:p-0' }">
    <AdminGameOs class="md:max-w-xl max-w-full mx-auto" />

    <UiFlex justify="center" class="gap-2 flex-wrap pt-4">
      <UButton 
        v-for="(item, index) in menus" :key="index"
        size="xl" 
        class="
          flex flex-col justify-center 
          h-36 w-36
        "
        :ui="{
          icon: { base: 'mb-2', size: { xl: 'h-10 w-10' } },
          font: 'font-semibold'
        }"
        :icon="item.icon"
        :color="item.color"
        @click="useTo().navigateToSSL(item.to)"
      >
        {{ item.label }}
      </UButton>
    </UiFlex>
  </UContainer>
</template>

<script setup>
const authStore = useAuthStore()
const profile = computed(() => authStore.profile)

const cfgStore = useConfigStore()
const config = computed(() => cfgStore.config)

const menus = [
  { label: 'Thống kê', icon: 'i-bxs-bar-chart-alt-2', to: '/admin/statistic' },
  { label: 'Nạp tiền', icon: 'i-bxs-credit-card', color: 'gray', to: '/admin/payment' },
  { label: 'Thành viên', icon: 'i-bxs-user', color: 'gray', to: '/admin/user' },
  { label: 'Cài đặt', icon: 'i-bxs-cog', color: 'gray', to: '/admin/config' },
]
</script>