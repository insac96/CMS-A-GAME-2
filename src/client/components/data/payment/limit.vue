<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
    <LoadingTable v-if="loading" />

    <UTable :columns="columns" :rows="data">
      <template #money-data="{ row }">
        <span v-if="row.money == -1">Không giới hạn</span>
        <span v-else>{{ toMoney(row.money) }}</span>
      </template>

      <template #count-data="{ row }">
        <span v-if="row.count == -1">Không giới hạn</span>
        <span v-else>{{ toMoney(row.count) }}</span>
      </template>
    </UTable>
  </UCard>
</template>

<script setup>
const { toMoney } = useMoney()

const props = defineProps({
  modelValue: Object,
  level: [ Number, String ],
  auth: Boolean
})
const emit = defineEmits(['update:modelValue'])

const loading = ref(true)
const levelData = ref(undefined)
const authData = ref(undefined)

const columns = computed(() => [
  {
    key: 'time',
    label: `Cấp ${levelData.value ? levelData.value.number : '0'}`
  },{
    key: 'money',
    label: 'Số tiền được nạp'
  },{
    key: 'count',
    label: 'Số lần được nạp'
  }
])

const data =  computed({
  get: () => {
    const limit = levelData.value && (levelData.value.limit ? levelData.value.limit.pay : null)
    const pay = authData.value && (authData.value.pay || null)
    let limitMoneyDay, limitCountyDay, limitMoneyMonth, limitCountMonth

    if(!limit) {
      emit('update:modelValue', { day: null, month: null })
      return []
    }
    else {
      if(!pay) {
        limitMoneyDay = limit.day?.money == 0 ? -1 : limit.day?.money
        limitCountyDay = limit.day?.count == 0 ? -1 : limit.day?.count
        limitMoneyMonth = limit.month?.money == 0 ? -1 : limit.month?.money
        limitCountMonth = limit.month?.count == 0 ? -1 : limit.month?.count
      }
      if(!!pay) {
        limitMoneyDay = limit.day?.money == 0 ? -1 : (limit.day?.money - pay.day?.money) < 0 ? 0 : (limit.day?.money - pay.day?.money)
        limitCountyDay = limit.day?.count == 0 ? -1 : (limit.day?.count - pay.day?.count) < 0 ? 0 : (limit.day?.count - pay.day?.count)
        limitMoneyMonth = limit.month?.money == 0 ? -1 : (limit.month?.money - pay.month?.money) < 0 ? 0 : (limit.month?.money - pay.month?.money)
        limitCountMonth = limit.month?.count == 0 ? -1 : (limit.month?.count - pay.month?.count) < 0 ? 0 : (limit.month?.count - pay.month?.count)
      }

      const result = [
        { time: 'Ngày', money: limitMoneyDay, count: limitCountyDay },
        { time: 'Tháng', money: limitMoneyMonth, count: limitCountMonth },
      ]
      
      emit('update:modelValue', { day: result[0], month: result[1] })
      return result
    }
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const fetch = async () => {
  try {
    const get = await useAPI('level/limit', { 
      number: props.level,
      auth: props.auth
    })
    
    levelData.value = get.level
    authData.value = get.auth
    loading.value = false
  }
  catch (e) {
    levelData.value = undefined
    authData.value = undefined
    loading.value = false
  }
}
fetch()
</script>