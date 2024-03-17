<template>
  <div>
    <UiFlex justify="center">
      <UTabs v-model="selected" :items="items" />
    </UiFlex>

    <MainShopPack v-if="selected == 0" />
    <MainShopItem v-if="selected == 1" />
  </div>
</template>

<script setup>
const items = [{
  label: 'Gói',
}, {
  label: 'Vật Phẩm',
}]

const selected = ref(0)
</script>