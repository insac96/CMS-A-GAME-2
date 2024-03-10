<template>
  <UiContent title="Statistic" sub="Thống kê số liệu">
    <AdminStatisticFast class="mb-4"/>

    <UiFlex class="mb-2">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <AdminStatisticPayment v-if="tab == 0"/>
    <AdminStatisticSignin v-if="tab == 1"/>
    <AdminStatisticSignup v-if="tab == 2"/>
  </UiContent>
</template>

<script setup>
const tab = ref(0)

const tabs = [
  { label: 'Nạp tiền', key: 'payment' },
  { label: 'Đăng nhập', key: 'signin' },
  { label: 'Đăng ký', key: 'signup' },
]
</script>