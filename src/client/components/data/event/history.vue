<template>
  <div>
    <UCard :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <template #header>
        <UiFlex justify="between">
          <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

          <USelectMenu 
            v-model="page.type" 
            value-attribute="value"
            option-attribute="label"
            :options="typeOptions"
          >
            <template #label>{{ page.type ? typeFormat[page.type] : 'Tất cả sự kiện' }}</template>
          </USelectMenu>  
        </UiFlex>
      </template>

      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #server-data="{ row }">
          <UBadge color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #type-data="{ row }">{{ typeFormat[row.type] }}</template>

        <template #need-data="{ row }">
          <UiText weight="semibold">{{ useMoney().toMoney(row.need) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>

      <template #footer>
        <UiFlex justify="end">
          <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
        </UiFlex>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps(['user'])


const route = useRoute()

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'type',
    label: 'Loại',
  },{
    key: 'need',
    label: 'Điều kiện',
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
    sortable: true
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  type: undefined,
  total: 0,
  user: props.user || null,
  secret: route.params._secret
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())

const typeFormat = {
  'login.month': 'Đăng nhập tháng',
  'login.total': 'Đăng nhập tổng',
  'pay.day.money': 'Tích nạp ngày',
  'pay.month.money': 'Tích nạp tháng',
  'pay.total.money': 'Tích nạp tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng',
  'spend.total.coin': 'Tiêu phí tổng',
}

const typeOptions = [
  { label: 'Tất cả sự kiện', value: undefined },
  { label: 'Đăng nhập tháng', value: 'login.month' },
  { label: 'Đăng nhập tổng', value: 'login.total' },
  { label: 'Tích nạp ngày', value: 'pay.day.money' },
  { label: 'Tích nạp tháng', value: 'pay.month.money' },
  { label: 'Tích nạp tổng', value: 'pay.total.money' },
  { label: 'Tiêu phí ngày', value: 'spend.day.coin' },
  { label: 'Tiêu phí tháng', value: 'spend.month.coin' },
  { label: 'Tiêu phí tổng', value: 'spend.total.coin' },
]

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/history', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>