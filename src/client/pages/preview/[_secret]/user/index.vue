<template>
  <UiContent title="User" sub="Tài khoản người dùng">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>
      <UForm :state="page" @submit="getList" class="mr-1">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'PHONE', 'MAIL', 'IP']" />
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
        <template #username-data="{ row }">
          <UBadge variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row._id)">
            {{ row.username }}
          </UBadge>
        </template>

        <template #level-data="{ row }">
          <UBadge color="primary" variant="soft">{{ `Cấp ${row.level || 0}` }}</UBadge>
        </template>
        
        <template #pay-data="{ row }">
          {{ toMoney(row.pay || 0) }}
        </template>

        <template #spend-data="{ row }">
          {{ toMoney(row.spend || 0) }}
        </template>

        <template #coin-data="{ row }">
          {{ toMoney(row.coin || 0) }}
        </template>

        <template #wheel-data="{ row }">
          {{ toMoney(row.wheel || 0) }}
        </template>

        <template #login-data="{ row }">
          {{ `${row.login || 0} ngày` }}
        </template>

        <template #ip-data="{ row }">
          {{ row.ip || '...' }}
        </template>

        <template #block-data="{ row }">
          <UBadge :color="row.block == 1 ? 'red' : 'gray'" variant="soft">{{ row.block == 1 ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #type-data="{ row }">
          <UBadge :color="typeFormat[row.type].color" variant="soft">
            {{ typeFormat[row.type].label }}
          </UBadge>
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
    key: 'username',
    label: 'Tên',
  },{
    key: 'level',
    label: 'Cấp độ',
    sortable: true
  },{
    key: 'pay',
    label: 'Tổng nạp',
    sortable: true
  },{
    key: 'spend',
    label: 'Tổng tiêu',
    sortable: true
  },{
    key: 'coin',
    label: 'Xu',
    sortable: true
  },{
    key: 'wheel',
    label: 'Lượt quay',
    sortable: true
  },{
    key: 'login',
    label: 'Đăng nhập',
    sortable: true
  },{
    key: 'ip',
    label: 'IP',
  },{
    key: 'block',
    label: 'Khóa',
    sortable: true
  },{
    key: 'type',
    label: 'Quyền',
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
    by: 'USER'
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

// Modal
const modal = ref({
  user: false,
})

// Loading
const loading = ref({
  load: true,
})

// Type
const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/admin/list', JSON.parse(JSON.stringify(page.value)))

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
