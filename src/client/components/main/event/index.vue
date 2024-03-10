<template>
  <div>
    <UiFlex justify="center">
      <UTabs v-model="selected" :items="items" />
    </UiFlex>

    <MainEventLogin v-if="selected == 0" />
    <MainEventPay v-if="selected == 1" />
    <MainEventSpend v-if="selected == 2" />
  </div>
</template>

<script setup>
const items = [{
  label: 'Điểm Danh',
}, {
  label: 'Tích Nạp',
}, {
  label: 'Tiêu Phí',
}]

const selected = ref(0)
</script>