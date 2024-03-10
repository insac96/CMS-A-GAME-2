<template>
  <div v-if="state">
    <UTabs v-model="tabItem" :items="tabItems" class="mb-4"></UTabs>

    <!-- Pay -->
    <div v-if="tabItem == 0">
      <UFormGroup label="Số tiền nạp ngày">
        <UInput v-model="state.pay.day.money" type="number" />
      </UFormGroup>

      <UFormGroup label="Lần nạp ngày">
        <UInput v-model="state.pay.day.count" type="number" />
      </UFormGroup>

      <UFormGroup label="Số tiền nạp tháng">
        <UInput v-model="state.pay.month.money" type="number" />
      </UFormGroup>

      <UFormGroup label="Lần nạp tháng">
        <UInput v-model="state.pay.month.count" type="number" />
      </UFormGroup>
    </div>

    <!-- Spend -->
    <div v-if="tabItem == 1">
      <UFormGroup label="Số xu tiêu ngày">
        <UInput v-model="state.spend.day.coin" type="number" />
      </UFormGroup>

      <UFormGroup label="Lần tiêu phí ngày">
        <UInput v-model="state.spend.day.count" type="number" />
      </UFormGroup>

      <UFormGroup label="Số xu tiêu tháng">
        <UInput v-model="state.spend.month.coin" type="number" />
      </UFormGroup>

      <UFormGroup label="Lần tiêu phí tháng">
        <UInput v-model="state.spend.month.count" type="number" />
      </UFormGroup>
    </div>

    <!-- Wheel -->
    <div v-if="tabItem == 2">
      <UFormGroup label="Số lần quay ngày">
        <UInput v-model="state.wheel.day" type="number" />
      </UFormGroup>

      <UFormGroup label="Số lần quay tháng">
        <UInput v-model="state.wheel.month" type="number" />
      </UFormGroup>
    </div>

    <!-- Dice -->
    <div v-if="tabItem == 3">
      <UFormGroup label="Số xu chơi ngày">
        <UInput v-model="state.dice.day.coin" type="number" />
      </UFormGroup>

      <UFormGroup label="Lần chơi ngày">
        <UInput v-model="state.dice.day.count" type="number" />
      </UFormGroup>

      <UFormGroup label="Số xu chơi tháng">
        <UInput v-model="state.dice.month.coin" type="number" />
      </UFormGroup>

      <UFormGroup label="Lần chơi tháng">
        <UInput v-model="state.dice.month.count" type="number" />
      </UFormGroup>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['limit'])
const emit = defineEmits(['update:limit'])

const state = ref(props.limit)
const tabItem = ref(0) 
const tabItems = [
  { label: 'Nạp tiền', key: 'pay' },
  { label: 'Tiêu phí', key: 'spend' },
  { label: 'Vòng quay', key: 'wheel' },
  { label: 'Xúc xắc', key: 'dice' },
]

const stateChange = computed(() => JSON.stringify(state.value))
watch(stateChange, (value) => emit('update:limit', JSON.parse(value)))
</script>