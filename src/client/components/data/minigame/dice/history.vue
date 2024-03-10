<template>
  <div>
    <UCard :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <template #header>
        <UiFlex justify="between">
          <UiText color="gray" weight="semibold">Lịch sử</UiText>
          <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" size="xs" />
        </UiFlex>
      </template>

      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #status-data="{ row }">
          <UBadge :color="row.receive > 0 ? 'green' : 'gray'">
            {{ row.receive > 0 ? 'Thắng' : 'Thua' }}
          </UBadge>
        </template>

        <template #play-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.play) }}</UiText>
        </template>

        <template #receive-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.receive + row.play) }}</UiText>
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
const { toMoney } = useMoney()

const props = defineProps(['reload', 'user'])

const route = useRoute()

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'dices',
    label: 'Kết quả',
  },{
    key: 'status',
    label: 'Trạng thái',
  },{
    key: 'play',
    label: 'Cước',
    sortable: true
  },{
    key: 'receive',
    label: 'Nhận',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày chơi',
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
  total: 0,
  user: props.user || null,
  secret: route.params._secret
})

watch(() => props.reload, () => getList())
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())


const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('minigame/dice/history', JSON.parse(JSON.stringify(page.value)))

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