<template>
  <div v-if="state">
    <UFormGroup label="Ngày đăng nhập">
      <UInput v-model="state.login" type="number" />
    </UFormGroup>

    <UFormGroup label="Tổng số tiền nạp">
      <UInput v-model="state.pay.money" type="number" />
    </UFormGroup>

    <UFormGroup label="Tổng số lần nạp">
      <UInput v-model="state.pay.count" type="number" />
    </UFormGroup>

    <UFormGroup label="Tổng số xu tiêu">
      <UInput v-model="state.spend.coin" type="number" />
    </UFormGroup>

    <UFormGroup label="Tổng số lần tiêu phí">
      <UInput v-model="state.spend.count" type="number" />
    </UFormGroup>
  </div>
</template>

<script setup>
const props = defineProps(['need'])
const emit = defineEmits(['update:need'])

const state = ref(props.need)
const stateChange = computed(() => JSON.stringify(state.value))
watch(stateChange, (value) => emit('update:need', JSON.parse(value)))
</script>