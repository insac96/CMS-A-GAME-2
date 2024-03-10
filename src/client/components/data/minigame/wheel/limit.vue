<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
    <LoadingTable v-if="loading" />

    <UTable :columns="columns" :rows="data">
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
    key: 'count',
    label: 'Số lần được quay'
  }
])

const data =  computed({
  get: () => {
    const limit = levelData.value && (levelData.value.limit ? levelData.value.limit.wheel : null)
    const wheel = authData.value && (authData.value.wheel || null)
    let limitCountDay, limitCountMonth

    if(!limit) {
      emit('update:modelValue', { day: null, month: null })
      return []
    }
    else {
      if(!wheel) {
        limitCountDay = limit.day == 0 ? -1 : limit.day
        limitCountMonth = limit.month == 0 ? -1 : limit.month
      }
      if(!!wheel) {
        limitCountDay = limit.day == 0 ? -1 : (limit.day - wheel.day) < 0 ? 0 : (limit.day - wheel.day)
        limitCountMonth = limit.month == 0 ? -1 : (limit.month - wheel.month) < 0 ? 0 : (limit.month - wheel.month)
      }

      const result = [
        { time: 'Ngày', count: limitCountDay },
        { time: 'Tháng', count: limitCountMonth },
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