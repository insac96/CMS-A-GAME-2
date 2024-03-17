<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-2 sm:p-2' } }">
    <LoadingTable v-if="loading" />

    <template #header>
      <UiFlex justify="end">
        <USelectMenu 
          v-model="typeShow" 
          value-attribute="value"
          option-attribute="label"
          :options="[
            { label: 'Số tiền', value: 'number' },
            { label: 'Số lần', value: 'count' },
          ]"
        >
          <template #label>{{ typeShow == 'number' ? 'Số tiền' : 'Số lần' }}</template>
        </USelectMenu>
      </UiFlex>
    </template>

    <UTable :columns="columns" :rows="data">
      <template #login-data="{ row }">{{ row.login == -1 ? '...' : `${row.login} ngày` }} </template>
      <template #pay-data="{ row }">{{ toMoney(row.pay) }} {{ typeShow == 'number' ? 'đ' : 'lần' }}</template>
      <template #spend-data="{ row }">{{ toMoney(row.spend) }} {{ typeShow == 'number' ? 'xu' : 'lần' }}</template>
      <template #wheel-data="{ row }">{{ toMoney(row.wheel) }} lần</template>
    </UTable>
  </UCard>
</template>

<script setup>
const props = defineProps(['typeDefault', 'user'])
const route = useRoute()
const { toMoney } = useMoney()
const authStore = useAuthStore()
const loading = ref(false)
const statistical = ref(undefined)
const typeShow = ref(props.typeDefault || 'number')

const columns = computed(() => {
  let data = [
    { key: 'pay', label: 'Nạp tiền' },
    { key: 'spend', label: 'Tiêu phí' },
  ]

  if(typeShow.value == 'count') {
    data.push({ key: 'wheel', label: 'Vòng quay' })
    data = [
      { key: 'login', label: 'Đăng nhập' },
    ].concat(data)
  }

  data = [{ key: 'time', label: `Theo` }].concat(data)
  return data
})

const data =  computed(() => {
  if(!statistical.value) return []
  const data = statistical.value
  const type = typeShow.value
  const typeMoney = type == 'number' ? 'money' : 'count'
  const typeCoin = type == 'number' ? 'coin' : 'count'
  
  return [{ 
    time: 'Ngày',
    pay: data.pay?.day[`${typeMoney}`],
    spend: data.spend?.day[`${typeCoin}`],
    wheel: data.wheel?.day,
    login: -1,
  },{ 
    time: 'Tháng',
    pay: data.pay?.month[`${typeMoney}`],
    spend: data.spend?.month[`${typeCoin}`],
    wheel: data.wheel?.month,
    login: data.login?.month,
  },{ 
    time: 'Tổng',
    pay: data.pay?.total[`${typeMoney}`],
    spend: data.spend?.total[`${typeCoin}`],
    wheel: data.wheel?.total,
    login: data.login?.total
  }]
})

const getStatistical = async () => {
  try {
    if(!authStore.isLogin) return

    loading.value = true
    const get = await useAPI('user/getStatistical', JSON.parse(JSON.stringify({
      user: props.user,
      secret: route.params._secret
    })))

    statistical.value = get
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}

getStatistical()
</script>