<template>
  <div>
    <UiFlex justify="center">
      <UTabs v-model="selected" :items="items" />
    </UiFlex>

    <MainEventLogin v-if="selected == 0" />
    <MainEventPay v-if="selected == 1" />
    <MainEventMusty v-if="selected == 2" />
    <MainEventSpend v-if="selected == 3" />
  </div>
</template>

<script setup>
const items = [{
  label: 'Điểm Danh',
}, {
  label: 'Tích Nạp',
}, {
  label: 'Nạp Đơn',
}, {
  label: 'Tiêu Phí',
}]

const selected = ref(0)
</script>