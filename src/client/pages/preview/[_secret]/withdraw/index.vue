<template>
  <UiContent title="Withdraw" sub="Giao dịch đổi xu">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-2"/>
      <UForm :state="page" @submit="getList" class="mr-4">
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
        <template #code-data="{ row }">
          <UiText weight="semibold" color="primary" pointer @click="viewWithdraw(row._id)">{{ row.code }}</UiText>
        </template>

        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user._id)">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #diamond-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.diamond) }}</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #verify_person-data="{ row }">
          <span v-if="!row.verify_person">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.verify_person._id)">
            {{ row.verify_person.username }}
          </UBadge>
        </template>

        <template #verify_time-data="{ row }">
          {{ row.verify_time ? useDayJs().displayFull(row.verify_time) : '...' }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <AdminUserInfo :user="stateUser" />
    </UModal>

    <!-- Modal Withdraw View -->
    <UModal v-model="modal.withdraw">
      <DataWithdrawView :fetch-id="stateWithdraw" />
    </UModal>
  </UiContent>
</template>

<script setup>
const route = useRoute()
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'user',
    label: 'Người tạo',
  },{
    key: 'diamond',
    label: 'Số tiền',
    sortable: true
  },{
    key: 'status',
    label: 'Trạng thái',
    sortable: true
  },{
    key: 'verify_person',
    label: 'Người duyệt',
  },{
    key: 'verify_time',
    label: 'Ngày duyệt',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
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
  secret: route.params._secret
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateUser = ref(undefined)
const stateWithdraw = ref(undefined)

// Modal
const modal = ref({
  success: false,
  refuse: false,
  user: false,
  withdraw: false
})

// Loading
const loading = ref({
  load: true,
  success: false,
  refuse: false
})

// Status
const statusFormat = {
  0: { label: 'Đang chờ', color: 'orange' },
  1: { label: 'Thành công', color: 'green' },
  2: { label: 'Từ chối', color: 'red' },
}

// Actions
const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

const viewWithdraw = (_id) => {
  stateWithdraw.value = _id
  modal.value.withdraw = true
}
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('withdraw/admin/list', JSON.parse(JSON.stringify(page.value)))

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
