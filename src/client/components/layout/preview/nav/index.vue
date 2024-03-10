<template>
  <div>
    <UAccordion 
      :items="navItems" 
      :ui="{
        'item': { padding: 'pt-0 pb-2 pl-6' },
      }"
      multiple
    >
      <template #default="{item, open}">
        <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
          <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'"/>
          <UiText 
            class="mx-4" 
            size="sm" 
            weight="semibold" 
            :color="open ? 'primary' : 'gray'"
            :text="item.label"
          />
          <UiIcon
            name="i-bx-chevron-right"
            size="5"
            :color="open ? 'primary' : 'gray'"
            class="ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </UiFlex>
      </template>
      <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
      <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
    </UAccordion>
  </div>
</template>

<script setup>
const route = useRoute()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: 'Tài khoản', to: `/preview/${route.params._secret}/user` }, 
      { label: 'Nạp tiền', to: `/preview/${route.params._secret}/payment` }, 
      { label: 'Đổi xu', to: `/preview/${route.params._secret}/withdraw` }, 
    ]
  },
  {
    label: 'Nhật ký',
    icon: 'i-bx-book',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      { label: 'Quản trị viên', to: `/preview/${route.params._secret}/log/admin` }, 
      { label: 'Gửi vật phẩm', to: `/preview/${route.params._secret}/log/adminSendItem` },
      { label: 'Địa chỉ IP', to: `/preview/${route.params._secret}/log/ip` }
    ]
  }
]
</script>