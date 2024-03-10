<template>
  <UiContent title="History Event" sub="Lịch sử nhận toàn hệ thống">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <UForm :state="page" @submit="getList" class="mr-2">
        <UInput size="sm" v-model="page.user" placeholder="Tìm kiếm theo tài khoản" />
      </UForm>

      <USelectMenu 
        v-model="page.type" 
        value-attribute="value"
        option-attribute="label"
        :options="typeOptions"
        class="ml-auto"
      >
        <template #label>{{ page.type ? typeFormat[page.type] : 'Tất cả sự kiện' }}</template>
      </USelectMenu>  
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
  type: undefined,
  user: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.user, (val) => !val && getList())

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true
})

// Type
const typeFormat = {
  'login.month': 'Đăng nhập tháng',
  'login.total': 'Đăng nhập tổng',
  'pay.day.money': 'Tích nạp ngày',
  'pay.month.money': 'Tích nạp tháng',
  'pay.total.money': 'Tích nạp tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng',
  'spend.total.coin': 'Tiêu phí tổng',
  'referral.count': 'Giới thiệu bạn'
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
  { label: 'Giới thiệu bạn', value: 'referral.count' }
]

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/admin/history', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('event/admin/delHistory', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
