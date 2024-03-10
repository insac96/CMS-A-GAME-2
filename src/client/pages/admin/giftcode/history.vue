<template>
  <UiContent title="History Giftcode" sub="Lịch sử nhận mã toàn hệ thống">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <UForm :state="page" @submit="getList">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
          <USelectMenu v-model="page.search.by" :options="['CODE', 'USER']" />
        </UiFlex>
      </UForm>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #user-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
        </template>

        <template #giftcode-data="{ row }">
          <UiText weight="semibold">{{ row.giftcode.code }}</UiText>
        </template>

        <template #server-data="{ row }">
          <UBadge color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #del-data="{ row }">
          <UButton color="gray" icon="i-bx-trash" :disabled="loading.del" @click="delAction(row._id)"/>
        </template>
      </UTable>
    </UCard>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <AdminUserInfo :user="stateUser" />
    </UModal>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'giftcode',
    label: 'Mã',
    sortable: true
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
    sortable: true
  },{
    key: 'del',
    label: 'Xóa',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'CODE'
  },
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true,
  del: false
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('giftcode/admin/history', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('giftcode/admin/delHistory', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
