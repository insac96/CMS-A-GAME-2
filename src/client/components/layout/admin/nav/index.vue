<template>
  <div>
    <UButton block size="md" class="mb-2" @click="openLink(runtimeConfig.public.clientURL)">Trang Chủ</UButton>

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
      <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
      <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template>
      <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emit('to')"/></template>
      <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emit('to')"/></template>
      <template #tab-6><UVerticalNavigation :links="navItems[6].children" @click="emit('to')"/></template>
      <template #tab-7><UVerticalNavigation :links="navItems[7].children" @click="emit('to')"/></template>
      <template #tab-8><UVerticalNavigation :links="navItems[8].children" @click="emit('to')"/></template>
      <template #tab-9><UVerticalNavigation :links="navItems[9].children" @click="emit('to')"/></template>
      <!-- <template #tab-10><UVerticalNavigation :links="navItems[10].children" @click="emit('to')"/></template>
      <template #tab-11><UVerticalNavigation :links="navItems[11].children" @click="emit('to')"/></template>
      <template #tab-12><UVerticalNavigation :links="navItems[12].children" @click="emit('to')"/></template>
      <template #tab-13><UVerticalNavigation :links="navItems[13].children" @click="emit('to')"/></template> -->
    </UAccordion>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: 'Thống kê', to: '/admin/statistic' },
      { label: 'Cài đặt', to: '/admin/config' },
    ]
  },
  {
    label: 'Quảng cáo',
    icon: 'i-bx-spreadsheet',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      // { label: 'Teaser', to: '/admin/ads/teaser' },
      { label: 'Landing', to: '/admin/ads/landing' },
      { label: 'From', to: '/admin/ads/from' }
    ]
  },
  {
    label: 'Thời gian thực',
    icon: 'i-bxs-timer',
    defaultOpen: false,
    slot: 'tab-2',
    children: [
      { label: 'Chức năng', to: '/admin/socket/action' },
      { label: 'Kênh chat', to: '/admin/socket/chat' },
    ]
  },
  // {
  //   label: 'Tin tức',
  //   icon: 'i-bx-news',
  //   defaultOpen: false,
  //   slot: 'tab-3',
  //   children: [
  //   { label: 'Danh mục', to: '/admin/news/category' }, 
  //   { label: 'Danh sách', to: '/admin/news' }, 
  //   ]
  // },
  {
    label: 'Tài khoản',
    icon: 'i-bx-user',
    defaultOpen: false,
    slot: 'tab-3',
    children: [
      { label: 'Danh sách', to: '/admin/user' }, 
      { label: 'Cấp độ', to: '/admin/user/level' },
      { label: 'Chức năng', to: '/admin/user/action' }, 
    ]
  },
  {
    label: 'Nạp tiền',
    icon: 'i-bx-credit-card',
    defaultOpen: false,
    slot: 'tab-4',
    children: [
      { label: 'Cài đặt', to: '/admin/payment/config' }, 
      { label: 'Kênh nạp', to: '/admin/payment/gate' }, 
      { label: 'Danh sách', to: '/admin/payment' }, 
    ]
  },
  // {
  //   label: 'Đổi xu',
  //   icon: 'i-bx-money-withdraw',
  //   defaultOpen: false,
  //   slot: 'tab-6',
  //   children: [
  //     { label: 'Danh sách', to: '/admin/withdraw' }, 
  //   ]
  // },
  {
    label: 'Trò chơi',
    icon: 'i-bx-cube-alt',
    defaultOpen: false,
    slot: 'tab-5',
    children: [
      { label: 'Gửi thư', to: '/admin/game/send' },
      { label: 'Vật phẩm', to: '/admin/game/item' },
      { label: 'Gói vật phẩm', to: '/admin/game/itembox' }, 
      { label: 'Máy chủ', to: '/admin/game/server' },
      { label: 'Nhân vật', to: '/admin/game/roles' },
      //{ label: 'Quà xếp hạng', to: '/admin/game/rankgift' },
    ]
  },
  {
    label: 'Giftcode',
    icon: 'i-bx-barcode-reader',
    defaultOpen: false,
    slot: 'tab-6',
    children: [
      { label: 'Danh sách', to: '/admin/giftcode' }, 
      { label: 'Lịch sử', to: '/admin/giftcode/history' }, 
    ]
  },
  {
    label: 'Cửa hàng',
    icon: 'i-bx-shopping-bag',
    defaultOpen: false,
    slot: 'tab-7',
    children: [
      { label: 'Cài đặt', to: '/admin/shop/config' },
      //{ label: 'Gói', to: '/admin/shop/pack' },
      { label: 'Vật phẩm', to: '/admin/shop/item' },
      //{ label: 'Tiền tệ', to: '/admin/shop/currency' }, 
      { label: 'Lịch sử', to: '/admin/shop/history' }, 
    ]
  },
  {
    label: 'Sự Kiện',
    icon: 'i-bx-calendar',
    defaultOpen: false,
    slot: 'tab-8',
    children: [
      { label: 'Cặt đặt', to: '/admin/event/config' }, 
      { label: 'Đăng nhập', to: '/admin/event/login' }, 
      { label: 'Tích nạp', to: '/admin/event/pay' }, 
      { label: 'Tiêu phí', to: '/admin/event/spend' },
      //{ label: 'Giới thiệu', to: '/admin/event/referral' },
      { label: 'Lịch sử', to: '/admin/event/history' },
    ]
  },
  // {
  //   label: 'Mini Game',
  //   icon: 'i-bx-game',
  //   defaultOpen: false,
  //   slot: 'tab-11',
  //   children: [
  //     { label: 'Vòng quay', to: '/admin/minigame/wheel' }, 
  //     { label: 'Xúc xắc', to: '/admin/minigame/dice' }
  //   ]
  // },
  // {
  //   label: 'Sự kiện hạn thời',
  //   icon: 'i-bxs-party',
  //   defaultOpen: false,
  //   slot: 'tab-12',
  //   children: [
  //     { label: 'Rút may mắn', to: '/admin/limitedevent/luckymoney' }, 
  //     { label: 'Liên nạp', to: '/admin/limitedevent/payment' }, 
  //     { label: 'Nạp đúng mốc', to: '/admin/limitedevent/paymission' },
  //     { label: 'Đập trứng', to: '/admin/limitedevent/egg' }, 
  //   ]
  // },
  {
    label: 'Nhật ký',
    icon: 'i-bx-book',
    defaultOpen: false,
    slot: 'tab-9',
    children: [
      { label: 'Quản trị viên', to: '/admin/log/admin' }, 
      { label: 'Gửi vật phẩm', to: '/admin/log/adminSendItem' },
      { label: 'Địa chỉ IP', to: '/admin/log/ip' }
    ]
  }
]

const openLink = (link) => {
  window.location.href = link
}
</script>