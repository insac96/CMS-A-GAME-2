<template>
  <div>
    <UCard :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'p-2 sm:p-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <template #header>
        <UiFlex justify="between">
          <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
        </UiFlex>
      </template>

      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #action-data="{ row }">
          <div class="whitespace-normal" v-html="row.action" />
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
  load: true,
  block: false
})

const modal = ref({
})

const list = ref([])

const columns = [
  {
    key: 'action',
    label: 'Hành động'
  },
  {
    key: 'createdAt',
    label: 'Thời gian',
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
  user: props.user,
  secret: route.params._secret
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('log/user', JSON.parse(JSON.stringify(page.value)))

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